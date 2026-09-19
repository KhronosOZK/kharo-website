"""
Kharo email (Resend, kharo.co.uk sending domain).

EDIT LATER: the values below come from /app/backend/.env and are safe to change:
  RESEND_API_KEY    - Resend API key, from resend.com once kharo.co.uk is verified
  EMAIL_FROM_NAME   - sender display name (currently "Kharo")
  EMAIL_FROM_ADDRESS- sending address (default noreply@kharo.co.uk)
  CONTACT_EMAIL     - reply-to address (e.g. hello@kharo.co.uk)
  ALERT_EMAIL       - where new-registration alerts are sent (founder inbox)
  DRIVER_DOC_URL    - link to the driver welcome document
  OPERATOR_DOC_URL  - link to the operator welcome document
  PUBLIC_BASE_URL   - site base url used for links (e.g. password reset)

If RESEND_API_KEY is not present, every send is skipped quietly so the app
keeps working. Emails start flowing automatically once the key is provisioned -
see resend.com: add kharo.co.uk as a sending domain, add the SPF/DKIM records
it gives you at the domain registrar, wait for verification, then set the key.

Falls back to the legacy Emergent-managed proxy (EMERGENT_EMAIL_KEY) if that's
set and RESEND_API_KEY isn't, so nothing breaks mid-migration.
"""
import os
import logging
import asyncio
import httpx

logger = logging.getLogger("kharo.email")

RESEND_BASE_URL = "https://api.resend.com"
# Legacy managed proxy, kept only as a fallback during migration.
EMERGENT_EMAIL_BASE_URL = "https://integrations.emergentagent.com"


def cfg(key: str, default: str = "") -> str:
    return os.environ.get(key, default)


async def send_email(to: str, subject: str, html: str) -> None:
    resend_key = os.environ.get("RESEND_API_KEY")
    emergent_key = os.environ.get("EMERGENT_EMAIL_KEY")
    from_name = cfg("EMAIL_FROM_NAME", "Kharo")
    reply_to = cfg("CONTACT_EMAIL")

    if resend_key:
        from_address = cfg("EMAIL_FROM_ADDRESS", "noreply@kharo.co.uk")
        payload = {
            "from": f"{from_name} <{from_address}>",
            "to": [to],
            "subject": subject,
            "html": html,
        }
        if reply_to:
            payload["reply_to"] = reply_to
        try:
            async with httpx.AsyncClient(timeout=30) as client:
                resp = await client.post(
                    f"{RESEND_BASE_URL}/emails",
                    headers={"Authorization": f"Bearer {resend_key}"},
                    json=payload,
                )
            if resp.status_code >= 400:
                detail = resp.text[:400]
                if resp.status_code == 403 and "verify a domain" in detail:
                    logger.error(
                        "Resend refused %s: the sending domain is not verified yet, so Resend "
                        "only delivers to the account owner. Verify %s at resend.com/domains.",
                        to, from_address.split("@")[-1],
                    )
                else:
                    logger.error("Resend %s sending to %s: %s", resp.status_code, to, detail)
                return
            logger.info("Email sent via Resend to %s (%s)", to, subject)
        except Exception as e:  # never let email break a request
            logger.error("Resend send failed to %s: %s", to, e)
        return

    if emergent_key:
        payload = {
            "to": [to],
            "subject": subject,
            "html": html,
            "from_name": from_name,
        }
        if reply_to:
            payload["contact_email"] = reply_to
        try:
            async with httpx.AsyncClient(timeout=30) as client:
                resp = await client.post(
                    f"{EMERGENT_EMAIL_BASE_URL}/api/v1/email/send",
                    headers={"X-Email-Key": emergent_key},
                    json=payload,
                )
            resp.raise_for_status()
            logger.info("Email sent via Emergent proxy to %s (%s)", to, subject)
        except Exception as e:
            logger.error("Emergent proxy send failed to %s: %s", to, e)
        return

    logger.warning("No email provider configured (RESEND_API_KEY unset); skipped email to %s (%s)", to, subject)


def fire(coro) -> None:
    """Fire-and-forget so the request is never blocked by email."""
    try:
        asyncio.create_task(coro)
    except RuntimeError:
        pass


# --------------------------------------------------------------- templates
SITE_URL = "https://kharo.co.uk"

DEFAULT_FOOTER = (
    "Kharo, the UK marketplace for private hire vehicle rental. "
    "If you did not expect this email you can ignore it."
)


def _socials() -> str:
    """Follow row for the marketing emails. Links come from the env so they
    can be corrected without a code change."""
    links = [
        ("Instagram", cfg("SOCIAL_INSTAGRAM")),
        ("LinkedIn", cfg("SOCIAL_LINKEDIN")),
        ("Facebook", cfg("SOCIAL_FACEBOOK")),
    ]
    live = [(n, u) for n, u in links if u]
    if not live:
        return ""
    row = " &nbsp;·&nbsp; ".join(
        f'<a href="{u}" style="color:#0B6B4F;text-decoration:none;font-weight:600;">{n}</a>'
        for n, u in live
    )
    return (
        "<p style='color:#7A857F;font-size:13px;line-height:1.6;margin:24px 0 0;'>"
        f"Follow the build: {row}</p>"
    )


def _shell(heading: str, body: str, preheader: str = "", footer: str = DEFAULT_FOOTER) -> str:
    """Letterhead wrapper. Table-based and inline-styled because email clients
    still are: Outlook ignores flexbox, Gmail strips <style> blocks."""
    return f"""<!doctype html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F7F7F4;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">{preheader}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#F7F7F4;padding:32px 12px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
  <tr><td align="center">
    <table role="presentation" width="580" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:580px;background:#ffffff;border:1px solid rgba(10,19,15,0.14);border-radius:10px;overflow:hidden;">

      <!-- Letterhead -->
      <tr><td style="padding:26px 36px 0;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td align="left" style="font-size:25px;font-weight:800;letter-spacing:-1px;color:#0A130F;">kharo<span style="color:#0B6B4F;">.</span></td>
            <td align="right" style="font-size:11px;font-weight:600;color:#5C6862;letter-spacing:0.04em;text-transform:uppercase;">Private hire rental</td>
          </tr>
        </table>
      </td></tr>
      <tr><td style="padding:18px 36px 0;"><div style="height:1px;background:rgba(10,19,15,0.14);line-height:1px;font-size:0;">&nbsp;</div></td></tr>

      <!-- Body -->
      <tr><td style="padding:28px 36px 34px;">
        <h1 style="margin:0 0 18px;font-size:21px;line-height:1.25;font-weight:700;color:#0A130F;letter-spacing:-0.3px;">{heading}</h1>
        {body}
      </td></tr>

      <!-- Footer -->
      <tr><td style="padding:18px 36px 24px;background:#F7F7F4;border-top:1px solid rgba(10,19,15,0.14);">
        <p style="margin:0 0 6px;font-size:12px;line-height:1.6;color:#5C6862;">{footer}</p>
        <p style="margin:0;font-size:12px;line-height:1.6;color:#5C6862;">
          <a href="{SITE_URL}" style="color:#0B6B4F;text-decoration:none;font-weight:600;">kharo.co.uk</a>
          &nbsp;&nbsp;<a href="mailto:{cfg('CONTACT_EMAIL', 'hello@kharo.co.uk')}" style="color:#5C6862;text-decoration:none;">{cfg('CONTACT_EMAIL', 'hello@kharo.co.uk')}</a>
        </p>
      </td></tr>

    </table>
  </td></tr>
</table>
</body></html>"""


def _btn(label: str, url: str) -> str:
    return (f'<a href="{url}" style="display:inline-block;background:#0B6B4F;color:#ffffff;'
            f'text-decoration:none;padding:12px 20px;border-radius:6px;font-weight:600;'
            f'font-size:14px;letter-spacing:0.01em;">{label}</a>')


async def send_welcome(role: str, to: str, name: str) -> None:
    first = (name or "there").split(" ")[0]
    if role == "operator":
        doc = cfg("OPERATOR_DOC_URL")
        body = (
            f"<p style='color:#4A5D54;font-size:15px;line-height:1.6;'>Hi {first}, thanks for registering your fleet interest with Kharo. "
            "Your account is ready, and we will be in touch as we open in your area.</p>"
            "<p style='color:#4A5D54;font-size:15px;line-height:1.6;'>Attached below is everything you need: your earning potential, "
            "the onboarding process, how verification works and how live vehicle tracking works.</p>"
            + (f"<p style='margin:20px 0;'>{_btn('Read your operator pack', doc)}</p>" if doc else
               "<p style='color:#7A857F;font-size:13px;'>[Your operator welcome document link will appear here.]</p>")
        )
        await send_email(to, "Welcome to Kharo, your fleet pack inside", _shell("You are on the list", body))
    else:
        doc = cfg("DRIVER_DOC_URL")
        body = (
            f"<p style='color:#4A5D54;font-size:15px;line-height:1.6;'>Hi {first}, welcome to Kharo. Your account is ready, so you can "
            "browse vetted cars in London and apply with your details already saved.</p>"
            "<p style='color:#4A5D54;font-size:15px;line-height:1.6;'>Here is your getting-started guide covering how renting works, "
            "what is included and what you could take home each week.</p>"
            + (f"<p style='margin:20px 0;'>{_btn('Read your driver guide', doc)}</p>" if doc else
               "<p style='color:#7A857F;font-size:13px;'>[Your driver welcome document link will appear here.]</p>")
        )
        await send_email(to, "Welcome to Kharo", _shell("Welcome aboard", body))


async def send_reset(to: str, link: str) -> None:
    body = (
        "<p style='color:#4A5D54;font-size:15px;line-height:1.6;'>We received a request to reset your Kharo password. "
        "This link is valid for one hour and can be used once.</p>"
        f"<p style='margin:20px 0;'>{_btn('Reset my password', link)}</p>"
        "<p style='color:#7A857F;font-size:13px;'>If you did not request this, you can safely ignore this email.</p>"
    )
    await send_email(to, "Reset your Kharo password", _shell("Password reset", body))


async def send_alert(kind: str, details: dict) -> None:
    to = cfg("ALERT_EMAIL")
    if not to:
        logger.info("ALERT_EMAIL not set; skipped alert (%s)", kind)
        return
    rows = "".join(
        f"<tr><td style='padding:4px 12px 4px 0;color:#7A857F;font-size:13px;'>{k}</td>"
        f"<td style='padding:4px 0;color:#1A2E25;font-size:13px;'>{v}</td></tr>"
        for k, v in details.items() if v
    )
    body = (f"<p style='color:#4A5D54;font-size:15px;'>New activity on Kharo: <b>{kind}</b>.</p>"
            f"<table cellpadding='0' cellspacing='0'>{rows}</table>")
    await send_email(to, f"Kharo: {kind}", _shell("New registration", body))


async def send_interest_thanks(role: str, to: str, name: str, city: str = "") -> None:
    """The letter a driver or operator gets after registering interest.

    Written as a letter, not a broadcast: says what we have, what we will do,
    and what we cannot promise yet. No launch date, because we do not have one.
    """
    if not to:
        return
    first = (name or "there").split(" ")[0]
    reply_to = cfg("CONTACT_EMAIL", "hello@kharo.co.uk")
    p = "margin:0 0 15px;font-size:15px;line-height:1.65;color:#2A3A33;"
    li = "margin:0 0 9px;font-size:15px;line-height:1.6;color:#2A3A33;"

    if role == "operator":
        where = f" across {city}" if city else ""
        body = (
            f"<p style='{p}'>Hi {first},</p>"
            f"<p style='{p}'>Thanks for putting your fleet forward. We have your details, and one of us "
            f"will ring you within a working day to go through your vehicles{where}, the rates you want to "
            f"set, and how the operator console works.</p>"
            f"<p style='{p}'>Worth saying plainly what we are: Kharo is the first marketplace of its kind "
            f"in the UK, and we are pre-launch. There is no live inventory yet. What we are doing right now "
            f"is lining up operators and drivers city by city so that when we open, cars get filled in days "
            f"rather than months.</p>"
            f"<p style='{p}'>The part operators tend to care about is the work we take off you. Applications "
            f"reach you with the DVLA, identity and affordability checks already done and the driver's chosen "
            f"insurance attached, so you approve or decline in one place. After that we watch the MOT dates, "
            f"the PHV plates, the servicing and the claims.</p>"
            f"<p style='{p}'><strong style='color:#0A130F;'>Next</strong></p>"
            f"<ol style='padding-left:19px;margin:0 0 18px;'>"
            f"<li style='{li}'>We call you within one working day.</li>"
            f"<li style='{li}'>We check your operator licence and Companies House record.</li>"
            f"<li style='{li}'>Your vehicles go live the day we open in your area.</li>"
            f"</ol>"
            f"<p style='margin:0 0 22px;'>{_btn('See how listing works', SITE_URL + '/operator-guide')}</p>"
            f"<p style='{p}'>If you know another operator with cars sitting on the forecourt, send this on. "
            f"The more fleets on at launch, the better this works for everyone on it.</p>"
            f"<p style='{p}'>Questions before we speak? Reply to this and it lands with us at {reply_to}.</p>"
            f"<p style='margin:24px 0 0;font-size:15px;line-height:1.6;color:#2A3A33;'>Best,<br>"
            f"<strong style='color:#0A130F;'>The Kharo team</strong></p>"
            + _socials()
        )
        await send_email(
            to,
            "Your fleet is on the Kharo list",
            _shell("Thanks for registering your fleet", body,
                   preheader="We will call you within one working day."),
        )
        return

    where = f" in {city}" if city else ""
    body = (
        f"<p style='{p}'>Hi {first},</p>"
        f"<p style='{p}'>You are on the list. We have saved the kind of car you are after{where}, and you "
        f"will hear from us the moment something matching it is ready to rent.</p>"
        f"<p style='{p}'>Straight with you about where we are: Kharo is the first marketplace of its kind in "
        f"the UK and we have not opened yet, so the cars on the site show what our launch operators rent out "
        f"rather than what you can book today. No launch date from us until we can actually hand somebody keys.</p>"
        f"<p style='{p}'>What we are building is one place for the whole thing. Most drivers deal with a "
        f"rental firm, then a broker for the insurance, then the platform onboarding, then a garage, then "
        f"whoever handles a claim when someone goes into the back of them. That is five phone numbers for "
        f"one car. With us it is one: you pick the car, you pick your cover from quotes we pull in, and we "
        f"get you live on Uber and Bolt before you collect, so the day you take the keys is a day you can earn.</p>"
        f"<p style='{p}'><strong style='color:#0A130F;'>Next</strong></p>"
        f"<ol style='padding-left:19px;margin:0 0 18px;'>"
        f"<li style='{li}'>We email you before we open in your area.</li>"
        f"<li style='{li}'>We match you to a real car on the terms you asked for.</li>"
        f"<li style='{li}'>You choose your insurance, and we put you in front of the operator.</li>"
        f"</ol>"
        f"<p style='margin:0 0 22px;'>{_btn('Browse the cars', SITE_URL + '/search')}</p>"
        f"<p style='{p}'>Know another driver hunting for a car? Pass this on. Operators come where the "
        f"drivers are, so every name on the list gets everyone on it into a car sooner.</p>"
        f"<p style='{p}'>Anything you want to ask, just reply. It reaches us at {reply_to}.</p>"
        f"<p style='margin:24px 0 0;font-size:15px;line-height:1.6;color:#2A3A33;'>Best,<br>"
        f"<strong style='color:#0A130F;'>The Kharo team</strong></p>"
        + _socials()
    )
    await send_email(
        to,
        "You are on the Kharo list",
        _shell("Thanks for joining the waitlist", body,
               preheader="We will email you when cars are ready in your city."),
    )
