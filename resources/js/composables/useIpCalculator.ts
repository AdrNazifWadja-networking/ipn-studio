import { ref, computed } from 'vue'

export interface IpMetadata {
  isValid: boolean
  ipVersion: 4 | 6 | null
  rawInput: string
  ipAddress: string
  cidr: number
  netmask: string
  wildcard: string
  networkAddress: string
  broadcastAddress: string
  firstUsable: string
  lastUsable: string
  totalHosts: number
  usableHosts: number
  ipClass: string
  isPrivate: boolean
  binary: { ip: string[], mask: string[] }
}

const input = ref('192.168.10.34/27')

export function useIpCalculator() {
  const metadata = computed<IpMetadata>(() => {
    const cleanInput = input.value.trim()
    const ipv4Regex = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})(?:\/(\d{1,2}))?$/
    if (!ipv4Regex.test(cleanInput)) return createInvalidState(cleanInput)
    
    const matches = cleanInput.match(ipv4Regex)!
    const octets = [parseInt(matches[1]), parseInt(matches[2]), parseInt(matches[3]), parseInt(matches[4])]
    const cidr = matches[5] ? parseInt(matches[5]) : 24
    if (octets.some(o => o > 255) || cidr > 32 || cidr < 0) return createInvalidState(cleanInput)

    const ipInt = ((octets[0] << 24) >>> 0) + (octets[1] << 16) + (octets[2] << 8) + octets[3]
    const maskInt = cidr === 0 ? 0 : (~0 << (32 - cidr)) >>> 0
    const wildcardInt = (~maskInt) >>> 0
    const netInt = (ipInt & maskInt) >>> 0
    const broadInt = (netInt | wildcardInt) >>> 0

    const intToIp = (num: number) => [(num >>> 24) & 255, (num >>> 16) & 255, (num >>> 8) & 255, num & 255].join('.')
    const toBinaryArray = (num: number) => {
      const str = (num >>> 0).toString(2).padStart(32, '0')
      return [str.slice(0,8), str.slice(8,16), str.slice(16,24), str.slice(24,32)]
    }

    let ipClass = 'D'
    if (octets[0] < 128) ipClass = 'A'; else if (octets[0] < 192) ipClass = 'B'; else if (octets[0] < 224) ipClass = 'C'

    return {
      isValid: true, ipVersion: 4, rawInput: cleanInput, ipAddress: octets.join('.'), cidr,
      netmask: intToIp(maskInt), wildcard: intToIp(wildcardInt), networkAddress: intToIp(netInt),
      broadcastAddress: intToIp(broadInt), firstUsable: cidr >= 31 ? 'N/A' : intToIp(netInt + 1),
      lastUsable: cidr >= 31 ? 'N/A' : intToIp(broadInt - 1), totalHosts: Math.pow(2, 32 - cidr),
      usableHosts: cidr >= 31 ? 0 : Math.pow(2, 32 - cidr) - 2, ipClass,
      isPrivate: (octets[0] === 10) || (octets[0] === 172 && octets[1] >= 16 && octets[1] <= 31) || (octets[0] === 192 && octets[1] === 168),
      binary: { ip: toBinaryArray(ipInt), mask: toBinaryArray(maskInt) }
    }
  })

  function updateCidr(newCidr: number) { input.value = `${input.value.split('/')[0]}/${newCidr}` }
  function toggleBit(octetIdx: number, bitIdx: number) {
    if (!metadata.value.isValid) return
    const currentBinary = metadata.value.binary.ip.map(o => o.split(''))
    currentBinary[octetIdx][bitIdx] = currentBinary[octetIdx][bitIdx] === '0' ? '1' : '0'
    input.value = `${currentBinary.map(o => parseInt(o.join(''), 2)).join('.')}/${metadata.value.cidr}`
  }

  return { input, metadata, updateCidr, toggleBit }
}

function createInvalidState(raw: string): IpMetadata {
  return { isValid: false, ipVersion: null, rawInput: raw, ipAddress: '', cidr: 24, netmask: '', wildcard: '', networkAddress: '', broadcastAddress: '', firstUsable: '', lastUsable: '', totalHosts: 0, usableHosts: 0, ipClass: '', isPrivate: false, binary: { ip: [], mask: [] } }
}