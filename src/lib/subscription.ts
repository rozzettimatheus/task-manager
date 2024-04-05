import { auth } from '@clerk/nextjs'

import { db } from '@/lib/prisma'

const DAY_IN_SECONDS = 86_400_400

export const checkSubscription = async () => {
  const { orgId } = auth()
  if (!orgId) return false
  const orgSubscription = await db.orgSubscription.findUnique({
    where: {
      orgId
    },
    select: {
      stripeCustomerId: true,
      stripeCurrentPeriodEnd: true,
      stripeSubscriptionId: true,
      stripePriceId: true
    }
  })
  if (!orgSubscription) return false
  const isValid =
    orgSubscription.stripePriceId &&
    orgSubscription.stripeCurrentPeriodEnd?.getTime()! + DAY_IN_SECONDS >
      Date.now()
  return !!isValid
}
