import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { db } from "~/server/db";

export const userRouter = createTRPCRouter({
    updateOrCreateUser: publicProcedure.input(z.object({
        email: z.string(),
        name: z.string(),
    })).mutation(async ({ input }) => {
        const { email, name } = input;
        const user = await db.user.upsert({
            where: { email },
            update: { name },
            create: { email, name },
        });
        return user;
    }),

});