"""
Kharo email scaffold (Emergent-managed Resend).

EDIT LATER: the values below come from /app/backend/.env and are safe to change
once the caro.uk domain and welcome documents are ready:
  EMAIL_FROM_NAME   - sender display name (currently "Kharo")
  CONTACT_EMAIL     - reply-to address
  ALERT_EMAIL       - where new-registration alerts are sent (founder inbox)
  DRIVER_DOC_URL    - link to the driver welcome document
  OPERATOR_DOC_URL  - link to the operator welcome document
  PUBLIC_BASE_URL   - site base url used for links (e.g. password reset)

If EMERGENT_EMAIL_KEY is not present, every send is skipped quietly so the app
keeps working. Emails start flowing automatically once the key is provisioned.
"""
import os
import logging
import asyncio
import httpx

logger = logging.getLogger("caro.email")

# Managed proxy — a constant on purpose so it survives deployment.
EMAIL_BASE_URL = "https://integrations.emergentagent.com"


def cfg(key: str, default: str = "") -> str:
    return os.environ.get(key, default)


async def send_email(to: str, subject: str, html: str) -> None:
    key = os.environ.get("EMERGENT_EMAIL_KEY")
    if not key:
        logger.warning("EMERGENT_EMAIL_KEY not set; skipped email to %s (%s)", to, subject)
        return
    payload = {
        "to": [to],
        "subject": subject,
        "html": html,
        "from_name": cfg("EMAIL_FROM_NAME", "Kharo"),
    }
    reply_to = cfg("CONTACT_EMAIL")
    if reply_to:
        payload["contact_email"] = reply_to
    try:
        async with httpx.AsyncClient(timeout=30) as client:
            resp = await client.post(
                f"{EMAIL_BASE_URL}/api/v1/email/send",
                headers={"X-Email-Key": key},
                json=payload,
            )
        resp.raise_for_status()
        logger.info("Email sent to %s (%s)", to, subject)
    except Exception as e:  # never let email break a request
        logger.error("Email send failed to %s: %s", to, e)


def fire(coro) -> None:
    """Fire-and-forget so the request is never blocked by email."""
    try:
        asyncio.create_task(coro)
    except RuntimeError:
        pass


# --------------------------------------------------------------- templates
def _shell(heading: str, body: str) -> str:
    return f"""
<table width="100%" cellpadding="0" cellspacing="0" style="background:#F9F8F6;padding:32px 0;font-family:Arial,Helvetica,sans-serif;">
  <tr><td align="center">
    <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #ececec;">
      <tr><td style="background:#0B130F;padding:24px 32px;">
        <span style="color:#ffffff;font-size:24px;font-weight:800;letter-spacing:-0.5px;">caro<span style="color:#5FD3A6;">.</span></span>
      </td></tr>
      <tr><td style="padding:32px;">
        <h1 style="margin:0 0 12px;font-size:22px;color:#1A2E25;">{heading}</h1>
        {body}
      </td></tr>
      <tr><td style="padding:20px 32px;background:#F1EFE9;color:#7A857F;font-size:12px;">
        Kharo, London's marketplace for private hire vehicle rental. If you did not expect this email you can ignore it.
      </td></tr>
    </table>
  </td></tr>
</table>"""


def _btn(label: str, url: str) -> str:
    return (f'<a href="{url}" style="display:inline-block;background:#0B6B4F;color:#ffffff;'
            f'text-decoration:none;padding:12px 22px;border-radius:999px;font-weight:600;font-size:14px;">{label}</a>')


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
