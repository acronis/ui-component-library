# Vue 3 Composable Style Guide

This guide is a comprehensive guide to writing Vue 3 composable.
It covers the best practices, naming conventions, and patterns to follow when writing Vue 3 composable.

Vue 3 composable is a new feature in Vue 3 that allows you to encapsulate and share logic across components.
That composable is easy to write, maintain test, and reuse.

## File names

- Always use `use` prefix for the composable file name.
- Use camelCase for the file name.

```bash
usePagination.ts
useFetch.ts
```

## Composable name

- use descriptive name for the composable

```typescript
export function usePagination() {}
```

## Directory structure

- place global composables in the `composables` directory;
- place component composables in the same directory as the component.

```bash
src/
└── composables/
    ├── usePagination.ts
    └── useUserData.ts
└── components/
    └── AcvUser/
        ├── AcvUser.vue
        └── useUserData.ts
```

## Arguments

- use object arguments for 4 or more parameters.

```typescript
usePagination({ total: 100, pageSize: 10, currentPage: 1, pageCount: 5 });
useFetch('https://api.com', 'GET');
```

## Error handling

- expose error state and error message.
- always try to throw error in the composable.

```typescript
const error = ref(null);

try {
  // Do something
}
catch (err) {
  error.value = err;
  throw err;
}

return { error };
```

## Do not mix UI and business logic

- decouple ui from business logic
- composable should focus on managing state and business logic
- keep UI logic in the component

```typescript
// Good
export function useUserData(userId) {
  const user = ref(null);
  const error = ref(null);

  async function fetchUser() {
    try {
      const response = await axios.get(`/api/users/${userId}`);
      user.value = response.data;
    }
    catch (e) {
      error.value = e;
      throw e;
    }
  };

  return { user, error, fetchUser };
}

// In component
function setup() {
  const { user, error, fetchUser } = useUserData(userId);

  watch(error, (newValue) => {
    if (newValue) {
      showToast('An error occurred.'); // UI logic in component
    }
  });

  return { user, fetchUser };
}
```

## Anatomy

- use well-defined sections in the composable
- primary state, main logic that composable is responsible for
- supportive state, secondary state that composable uses, like hold values, etc.
- methods, functions that composable uses for updating states

```typescript
export function useUserData(userId) {
  // Primary State
  const user = ref(null);
  const error = ref(null);

  // Supportive State
  const status = ref('idle');

  // Methods
  async function fetchUser() {
    status.value = 'loading';
    try {
      const response = await axios.get(`/api/users/${userId}`);

      user.value = response.data;
      status.value = 'success';
    }
    catch (e) {
      status.value = 'error';
      error.value = e;
      throw e;
    }
  };

  return { user, error, fetchUser };
}
```

## Structure

Use such file structure for the composable:

- Initialization of logic
- Refs, reactive references
- Computed properties
- Methods and functions
- Lifecycle hooks
- Watch
- Return statement

```typescript
export default function useCounter() {
  // Initializing
  // Initialize variables, make API calls, or any setup logic
  // For example, using a router
  // ...

  // Refs
  const count = ref(0);

  // Computed
  const isEven = computed(() => count.value % 2 === 0);

  // Methods
  function increment() {
    count.value++;
  };

  function decrement() {
    count.value--;
  };

  // Lifecycle
  onMounted(() => {
    console.log('Counter is mounted');
  });

  return {
    count,
    isEven,
    increment,
    decrement,
  };
}
```

## Functional core, imperative shell

- keep the core of the composable functional and avoid side effects.
- use imperative shell for Vue-specific or side effects operations.

```typescript
function calculate(a, b) {
  return a + b;
}

// Imperative Shell
export function useCalculator() {
  const result = ref(0);

  function add(a, b) {
    result.value = calculate(a, b); // Using the functional core
  };

  // Other side-effecting code can go here, e.g., logging, API calls

  return { result, add };
}
```

## Single responsibility

- composable should have a single responsibility.
- decompose complex logic into smaller composables.

```typescript
export function useCounter() {
  const count = ref(0);

  function increment() {
    count.value++;
  };

  function decrement() {
    count.value--;
  };

  return { count, increment, decrement };
}
```
