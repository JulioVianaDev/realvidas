# TanStack Query Hooks - Payment System

## Overview
All payment-related hooks use `@tanstack/react-query` (formerly React Query v4+) for data fetching and state management.

## Hook Structure

### Location
```
frontend/src/hooks/
├── action/
│   ├── payment/payment.action.ts       # API calls
│   ├── subscription/subscription.action.ts
│   └── plan/plan.action.ts
└── query/
    ├── payment/payment.query.ts        # TanStack Query hooks
    ├── subscription/subscription.query.ts
    └── plan/plan.query.ts
```

---

## Payment Hooks

### File: `hooks/query/payment/payment.query.ts`

#### Query Hooks

```typescript
import { useQuery } from "@tanstack/react-query";

// Get all payments
const { data, isLoading, error } = useGetAllPaymentsQuery({
    page: 1,
    pageSize: 10,
});

// Get payment by ID
const { data } = useGetPaymentByIdQuery("payment_id", enabled);

// Get payments by enterprise
const { data } = useGetPaymentsByEnterpriseQuery({
    enterpriseId: "enterprise_id",
    page: 1,
});

// Get payment statistics
const { data } = useGetPaymentStatsQuery({
    enterpriseId: "enterprise_id",
});
```

#### Mutation Hooks

```typescript
import { useMutation } from "@tanstack/react-query";

// Create payment
const createMutation = useCreatePaymentMutation();
createMutation.mutate({
    enterpriseId: "xyz",
    amountInCents: 22700,
    paymentMethod: "PIX",
});

// Update payment
const updateMutation = useUpdatePaymentMutation();
updateMutation.mutate({
    id: "payment_id",
    payload: { status: "PAID" },
});

// Check payment status
const checkStatusMutation = useCheckPaymentStatusMutation();
checkStatusMutation.mutate("payment_id");
```

#### Configuration

All payment queries use:
```typescript
{
    refetchOnMount: false,
    refetchInterval: false,
    refetchOnWindowFocus: false,
}
```

---

## Subscription Hooks

### File: `hooks/query/subscription/subscription.query.ts`

#### Query Hooks

```typescript
// Get all subscriptions
const { data } = useGetAllSubscriptionsQuery({
    page: 1,
    pageSize: 10,
});

// Get subscription by ID
const { data } = useGetSubscriptionByIdQuery("sub_id", enabled);

// Get subscription with plan details
const { data } = useGetSubscriptionWithPlanQuery("sub_id", enabled);

// Get subscriptions by enterprise
const { data } = useGetSubscriptionsByEnterpriseQuery({
    enterpriseId: "enterprise_id",
});

// Get active subscription
const { data } = useGetActiveSubscriptionByEnterpriseQuery(
    "enterprise_id",
    enabled
);
```

#### Mutation Hooks

```typescript
// Create subscription
const createMutation = useCreateSubscriptionMutation();
createMutation.mutate({
    enterpriseId: "xyz",
    planId: "starter",
    billingCycle: "MONTHLY",
});

// Cancel subscription
const cancelMutation = useCancelSubscriptionMutation();
cancelMutation.mutate({
    id: "sub_id",
    payload: { reason: "No longer needed" },
});

// Reactivate subscription
const reactivateMutation = useReactivateSubscriptionMutation();
reactivateMutation.mutate({
    id: "sub_id",
    payload: {},
});

// Update subscription
const updateMutation = useUpdateSubscriptionMutation();
updateMutation.mutate({
    id: "sub_id",
    payload: { status: "ACTIVE" },
});
```

---

## Plan Hooks

### File: `hooks/query/plan/plan.query.ts`

#### Query Hooks

```typescript
// Get all plans
const { data } = useGetAllPlansQuery({
    page: 1,
    pageSize: 10,
    isActive: true,
});

// Get active plans
const { data } = useGetActivePlansQuery({
    currency: "BRL",
});

// Get plan by ID
const { data } = useGetPlanByIdQuery("plan_id", enabled);

// Get plan by name
const { data } = useGetPlanByNameQuery("starter", enabled);
```

#### Mutation Hooks

```typescript
// Create plan (Admin only)
const createMutation = useCreatePlanMutation();
createMutation.mutate({
    name: "enterprise",
    displayName: "Enterprise",
    priceMonthly: 199900,
    currency: "BRL",
});

// Update plan (Admin only)
const updateMutation = useUpdatePlanMutation();
updateMutation.mutate({
    id: "plan_id",
    payload: { priceMonthly: 189900 },
});
```

---

## TanStack Query Features

### 1. Automatic Cache Management

```typescript
// Data is cached by query key
const { data } = useGetPaymentByIdQuery("payment_123");

// Same query reuses cached data
const { data: sameData } = useGetPaymentByIdQuery("payment_123");
```

### 2. Automatic Refetching

Queries are configured to NOT refetch automatically:
- ❌ `refetchOnMount: false`
- ❌ `refetchInterval: false`
- ❌ `refetchOnWindowFocus: false`

This gives you full control over when data is fetched.

### 3. Optimistic Updates

Mutations automatically invalidate related queries:

```typescript
// When a payment is created
useCreatePaymentMutation() // invalidates:
    ↓
    - API_ROUTES.PAYMENT.GET_ALL
    - API_ROUTES.PAYMENT.GET_STATS

// When a subscription is canceled
useCancelSubscriptionMutation() // invalidates:
    ↓
    - API_ROUTES.SUBSCRIPTION.GET_BY_ID(id)
    - API_ROUTES.SUBSCRIPTION.GET_ALL
```

### 4. Loading States

```typescript
const { data, isLoading, isFetching, error } = useGetAllPaymentsQuery({
    page: 1,
});

if (isLoading) return <LoadingSpinner />;
if (error) return <ErrorMessage error={error} />;
return <PaymentList data={data} />;
```

### 5. Mutation States

```typescript
const mutation = useCreatePaymentMutation();

// Submit
const handleSubmit = (formData) => {
    mutation.mutate(formData, {
        onSuccess: (data) => {
            toast.success("Payment created!");
        },
        onError: (error) => {
            toast.error("Failed to create payment");
        },
    });
};

// UI feedback
{mutation.isPending && <Spinner />}
{mutation.isError && <ErrorAlert />}
{mutation.isSuccess && <SuccessMessage />}
```

---

## Usage Examples

### Complete Payment Flow

```typescript
import {
    useGetActivePlansQuery,
    useCreateSubscriptionMutation,
    useCreatePaymentMutation,
    useCheckPaymentStatusMutation,
} from "@/hooks/query";

function PaymentFlow() {
    const { data: plans } = useGetActivePlansQuery({ currency: "BRL" });
    const createSubscription = useCreateSubscriptionMutation();
    const createPayment = useCreatePaymentMutation();
    const checkStatus = useCheckPaymentStatusMutation();

    const handleSelectPlan = async (planId: string) => {
        // 1. Create subscription
        const subscription = await createSubscription.mutateAsync({
            enterpriseId,
            planId,
            billingCycle: "MONTHLY",
        });

        // 2. Create payment
        const payment = await createPayment.mutateAsync({
            subscriptionId: subscription.id,
            enterpriseId,
            amountInCents: subscription.priceInCents,
            paymentMethod: "PIX",
        });

        // 3. Open payment URL
        window.open(payment.abacatePayUrl, "_blank");

        // 4. Check status periodically
        const interval = setInterval(async () => {
            const updated = await checkStatus.mutateAsync(payment.id);
            if (updated.status === "PAID") {
                clearInterval(interval);
                toast.success("Payment confirmed!");
            }
        }, 5000);
    };

    return (
        <div>
            {plans?.map((plan) => (
                <PlanCard
                    key={plan.id}
                    plan={plan}
                    onSelect={() => handleSelectPlan(plan.id)}
                />
            ))}
        </div>
    );
}
```

### Subscription Management

```typescript
import {
    useGetActiveSubscriptionByEnterpriseQuery,
    useCancelSubscriptionMutation,
} from "@/hooks/query";

function SubscriptionManager() {
    const { data: subscription, isLoading } =
        useGetActiveSubscriptionByEnterpriseQuery(enterpriseId);

    const cancelMutation = useCancelSubscriptionMutation();

    const handleCancel = () => {
        cancelMutation.mutate(
            {
                id: subscription.id,
                payload: { reason: "User requested cancellation" },
            },
            {
                onSuccess: () => {
                    toast.success("Subscription canceled");
                },
            }
        );
    };

    if (isLoading) return <Skeleton />;
    if (!subscription) return <NoSubscription />;

    return (
        <div>
            <h2>{subscription.plan.displayName}</h2>
            <p>Status: {subscription.status}</p>
            <Button onClick={handleCancel}>Cancel Subscription</Button>
        </div>
    );
}
```

---

## Query Keys

All hooks use structured query keys for cache management:

```typescript
// Payments
[API_ROUTES.PAYMENT.GET_ALL, params]
[API_ROUTES.PAYMENT.GET_BY_ID(id), id]
[API_ROUTES.PAYMENT.GET_STATS, params]

// Subscriptions
[API_ROUTES.SUBSCRIPTION.GET_ALL, params]
[API_ROUTES.SUBSCRIPTION.GET_BY_ID(id), id]
[API_ROUTES.SUBSCRIPTION.GET_ACTIVE_BY_ENTERPRISE(enterpriseId), enterpriseId]

// Plans
[API_ROUTES.PLAN.GET_ALL, params]
[API_ROUTES.PLAN.GET_ACTIVE, params]
[API_ROUTES.PLAN.GET_BY_ID(id), id]
```

---

## Best Practices

### 1. ✅ Use Enabled Flag for Conditional Queries

```typescript
// Good: Only fetch when ID is available
const { data } = useGetPaymentByIdQuery(paymentId, !!paymentId);

// Bad: Always tries to fetch
const { data } = useGetPaymentByIdQuery(paymentId);
```

### 2. ✅ Handle Loading and Error States

```typescript
const { data, isLoading, error } = useGetAllPaymentsQuery(params);

if (isLoading) return <LoadingSpinner />;
if (error) return <ErrorMessage error={error} />;
if (!data) return null;

return <PaymentList data={data} />;
```

### 3. ✅ Use Mutation Callbacks

```typescript
mutation.mutate(payload, {
    onSuccess: (data) => {
        toast.success("Success!");
        navigate("/payments");
    },
    onError: (error) => {
        toast.error(error.message);
    },
});
```

### 4. ✅ Leverage Query Invalidation

Mutations automatically invalidate related queries, so you don't need to manually refetch:

```typescript
// ❌ Bad: Manual refetch
const createPayment = useCreatePaymentMutation();
const { refetch } = useGetAllPaymentsQuery(params);

await createPayment.mutateAsync(payload);
refetch(); // Not needed!

// ✅ Good: Automatic invalidation
const createPayment = useCreatePaymentMutation();
await createPayment.mutateAsync(payload);
// All payment queries automatically refetch
```

---

## Migration Notes

### From react-query to @tanstack/react-query

All hooks have been updated:

```diff
- import { useQuery, useMutation } from "react-query";
+ import { useQuery, useMutation } from "@tanstack/react-query";
```

No other changes needed! TanStack Query v4/v5 is backward compatible with React Query v3 API.

---

## Summary

✅ **All hooks use @tanstack/react-query**
✅ **Consistent patterns across all payment hooks**
✅ **Automatic cache management**
✅ **Optimistic updates**
✅ **Type-safe with TypeScript**
✅ **Query invalidation on mutations**
✅ **No manual refetching needed**

The payment system hooks are production-ready with TanStack Query! 🚀

