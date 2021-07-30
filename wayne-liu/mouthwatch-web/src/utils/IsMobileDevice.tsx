export const isMobileDevice = () => {
  // device detection
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|bb|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    return true
  }

  return false
}
