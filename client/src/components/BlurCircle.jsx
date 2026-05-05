const BlurCircle = ({
  top = 'auto',
  left = 'auto',
  right = 'auto',
  bottom = 'auto',
}) => {
  return (
    <div
      className="absolute -z-10 h-44 w-44 rounded-full bg-primary/25 blur-3xl"
      style={{ top, left, right, bottom }}
    />
  )
}

export default BlurCircle