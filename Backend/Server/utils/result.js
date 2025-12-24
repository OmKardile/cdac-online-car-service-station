exports.createResult = (error, data) => {
  if (error)
    return { status: 'error', error }
  return { status: 'success', data }
}
