export function numberFormatting(value: number | string): string {
  const number = typeof value === 'string' ? Number(value) : value
  if (Number.isNaN(number)) return '0'
  return new Intl.NumberFormat('ko-KR').format(number)
}

export function isValidPhoneNumber(value: string): boolean {
  if (!value) return false
  return /^01(0|1|[6-9])[-\s]?\d{3,4}[-\s]?\d{4}$/.test(value)
}

