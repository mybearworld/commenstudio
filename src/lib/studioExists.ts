export const studioExists = async (id: number) => {
  return (
    (
      await fetch(
        `https://api.codetabs.com/v1/proxy?quest=https://api.scratch.mit.edu/studios/${id}`,
      )
    ).status === 200
  );
};
