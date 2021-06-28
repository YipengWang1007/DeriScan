export const validateAddress = (address) => {
  return address.trim().startsWith('0x') && address.trim().length === 42
}

export const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text)
}
