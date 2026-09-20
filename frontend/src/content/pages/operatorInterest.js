// Copy that belongs only to the list-your-fleet page and is not part of the
// shared OPERATOR_INTEREST block in site.js.
export const OPERATOR_INTEREST_PAGE = {
  // The three trust points, said once as a sentence under the form.
  trustSentence: "Checked drivers only, free to list, and a call within one working day.",
  stepLabel: (n, total) => `Step ${n} of ${total}`,
  back: "Back",
  continueCta: "Continue",
  submitCta: "Request a call back",
  sending: "Sending",
  whatsapp: "Prefer WhatsApp? Message us instead",
  whatsappMessage: "Hi Kharo, I'd like to list my fleet.",
  carUnit: (n) => (n === 1 ? "car" : "cars"),
  success: {
    home: "Back to home",
    guide: "For operators",
  },
  errors: {
    required: "Please fill this in to continue.",
    failed: "Something went wrong. Please try again.",
  },
};
