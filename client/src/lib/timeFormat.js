const timeFormat = (time) => {
  const hours = Math.floor(time / 60)
  const minutesRemainder = time % 60

  return `${hours}h ${minutesRemainder}m`
}

export default timeFormat