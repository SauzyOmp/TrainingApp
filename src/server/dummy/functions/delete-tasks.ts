import { makeDummy } from "@fhss-web-team/backend-utils";
import { prisma } from "../../../../prisma/client";

export const deleteTasks = makeDummy({
  name: "Delete tasks",
  description: "I am a lazy who didn't update the description.",
  handler: async () => {
    return await prisma.task.deleteMany({})
  },
});