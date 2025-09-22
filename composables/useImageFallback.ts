export const useImageFallback = () => {
  const handleImageError = (event: Event, context?: string) => {
    const img = event.target as HTMLImageElement
    
    // Prevent infinite error loop
    if (img.src.includes('Sorotan.svg')) return
    
    // Get image dimensions to maintain aspect ratio
    const containerWidth = img.offsetWidth || img.parentElement?.offsetWidth || 300
    const containerHeight = img.offsetHeight || img.parentElement?.offsetHeight || 200
    
    // Determine fallback based on context or class names
    let fallbackSrc = '/img/Sorotan.svg'
    
    // Apply CSS to make the fallback image fit better
    img.style.objectFit = 'contain'
    img.style.objectPosition = 'center'
    img.style.backgroundColor = '#f5f5f5'
    img.style.padding = '1rem'
    
    // Set the fallback source
    img.src = fallbackSrc
  }
  
  return {
    handleImageError
  }
}