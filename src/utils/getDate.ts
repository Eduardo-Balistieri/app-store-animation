const getFormatedDate = () => {
  const date = new Date()

  const weekDays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
  const months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december']

  return `${weekDays[date.getDay()]} ${date.getDate()} ${months[date.getMonth()]}`
}

export { getFormatedDate }