export function formatINR(paise: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(paise);
}

export function genReference(prefix = "STP") {
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  const ts = Date.now().toString().slice(-6);
  return `${prefix}-${ts}-${rand}`;
}

export function genTxnId() {
  return "TXN" + Math.random().toString(36).slice(2, 12).toUpperCase();
}
