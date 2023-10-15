import { proxy } from "./proxy";

export const studioExists = async (id: number) => {
  return (
    (await proxy(`https://api.scratch.mit.edu/studios/${id}`)).status === 200
  );
};
