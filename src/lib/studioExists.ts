export const studioExists = async (id: number) => {
  return (await fetch(`https://corsproxy.io?https://api.scratch.mit.edu/studios/${id}`)).status === 200
}