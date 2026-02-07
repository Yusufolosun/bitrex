# Bitrex Frontend - Development Guide

This guide provides detailed information for developers working on the Bitrex frontend application.

## Development Workflow

### Branch Strategy

The project uses a Git flow branching model:

- `main` - Production-ready code
- `dev` - Integration branch for tested features
- `feature/*` - Feature development branches

**Workflow:**
1. Create feature branch from `dev`: `git checkout -b feature/my-feature dev`
2. Make atomic commits with descriptive messages
3. Merge to `dev` with `--no-ff` flag: `git merge feature/my-feature --no-ff`
4. Delete feature branch after merge
5. Periodically merge `dev` to `main` for releases

### Commit Conventions

Follow semantic commit messages:

- `feat(scope): description` - New features
- `fix(scope): description` - Bug fixes
- `docs(scope): description` - Documentation changes
- `chore(scope): description` - Build tasks, dependencies
- `refactor(scope): description` - Code refactoring
- `test(scope): description` - Test additions/changes
- `style(scope): description` - Code style changes

**Examples:**
```
feat(vault): add deposit modal component
fix(wallet): correct network switching logic
docs(readme): update installation instructions
```

## Project Setup

### Initial Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run in separate terminal: Clarinet console (for contract interaction)
cd ..
clarinet console
```

### Required Browser Extensions

- **Hiro Wallet**, **Xverse**, or **Leather** for Stacks blockchain interaction
- **React Developer Tools** (recommended)

## Architecture

### Component Organization

```
src/components/
├── common/       # Reusable UI components
├── vault/        # Vault-specific features
└── wallet/       # Wallet integration
```

**Guidelines:**
- Keep components focused and single-purpose
- Extract reusable logic to custom hooks
- Place shared types in `src/types/index.ts`

### State Management

- **Global State**: React Context API (`WalletContext`)
- **Component State**: `useState` for local UI state
- **Server State**: Custom hooks (`useContractRead`, `useVaultData`)

### Styling Approach

**Tailwind CSS Utility-First:**
```tsx
// Good
<div className="card bg-red-50 border-red-200">

// Avoid
<div style={{ backgroundColor: 'red' }}>
```

**Custom Classes** (defined in `index.css`):
- `card` - Standard card container
- `btn-primary` - Primary action button
- `btn-secondary` - Secondary action button

## Contract Integration

### Reading Contract Data

```tsx
import { useContractRead } from '../hooks/useContractRead';

const { data, loading, error, refetch } = useContractRead({
  contractAddress: 'ST1...',
  contractName: 'vault-core',
  functionName: 'get-vault-info',
  functionArgs: [],
}, transformFunction);
```

### Writing to Contracts

```tsx
import { openContractCall } from '@stacks/connect';
import { buildDepositArgs } from '../utils/contracts';

const txOptions = buildDepositArgs(amount, network);
await openContractCall({
  ...txOptions,
  network: networkConfig.network,
  onFinish: (data) => console.log(data.txId),
  onCancel: () => console.log('Cancelled'),
});
```

## Testing Strategy

### Manual Testing Checklist

**Wallet Connection:**
- [ ] Connect wallet successfully
- [ ] Disconnect wallet
- [ ] Switch networks (Devnet/Testnet/Mainnet)
- [ ] Wallet info displays correctly

**Vault Dashboard:**
- [ ] Vault stats load and display
- [ ] User position shows correct data
- [ ] Refresh button updates data
- [ ] Loading states show during fetch

**Deposit Flow:**
- [ ] Modal opens on button click
- [ ] Amount validation works
- [ ] Transaction submits successfully
- [ ] Data refreshes after deposit
- [ ] Error handling works

**Withdraw Flow:**
- [ ] Modal opens correctly
- [ ] MAX button fills available shares
- [ ] Balance validation prevents overdraw
- [ ] Transaction submits successfully
- [ ] Data refreshes after withdrawal

### Local Testing with Clarinet

1. **Start Clarinet Console:**
```bash
cd ..
clarinet console
```

2. **Deploy Contracts** (in Clarinet console):
```clarity
(contract-call? .vault-core deposit u1000000)
```

3. **Switch Frontend to Devnet:**
- Click network switcher
- Select "Devnet"
- Connect wallet

4. **Test Transactions:**
- Use test wallets from `settings/Simnet.toml`
- Default deployer: `ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM`

## Common Development Tasks

### Adding a New Component

1. Create component file in appropriate directory
2. Export component with named export
3. Add TypeScript types for props
4. Include JSDoc comment describing purpose
5. Commit atomically

**Example:**
```tsx
interface MyComponentProps {
  title: string;
  onAction: () => void;
}

/**
 * Brief description of component purpose
 */
export function MyComponent({ title, onAction }: MyComponentProps) {
  return <div>{title}</div>;
}
```

### Adding a New Hook

1. Create hook file in `src/hooks/`
2. Prefix function name with `use`
3. Return object with data, loading, error states
4. Add TypeScript return type
5. Document with JSDoc

### Updating Types

Edit `src/types/index.ts` to add or modify TypeScript interfaces.

## Performance Optimization

### Best Practices

- **Memoization**: Use `useMemo` for expensive calculations
- **Callbacks**: Use `useCallback` for event handlers passed to children
- **Code Splitting**: Dynamic imports for large components
- **Image Optimization**: Use WebP format where possible

### Network Request Optimization

- Batch read-only contract calls when possible
- Implement request debouncing for user input
- Cache contract read results with appropriate TTL

## Debugging

### Browser DevTools

**React DevTools:**
- Inspect component tree
- View props and state
- Track re-renders

**Network Tab:**
- Monitor contract calls
- Check transaction broadcasts
- Verify API responses

### Console Logging

```tsx
// Development only - remove before production
console.log('Debug:', { data, loading, error });
```

### Common Issues

**Wallet Won't Connect:**
- Check wallet extension is unlocked
- Verify correct network selected
- Clear browser cache/cookies

**Contract Reads Fail:**
- Verify contract deployed to network
- Check contract address in constants
- Confirm function name matches contract

**TypeScript Errors:**
- Run `npm run build` to check for type errors
- Ensure all props have proper types
- Check imports are correct

## Code Quality

### ESLint

```bash
npm run lint
```

Fix auto-fixable issues:
```bash
npx eslint . --fix
```

### TypeScript

Build TypeScript to check for errors:
```bash
npm run build
```

### Code Review Checklist

- [ ] No console.log statements in production code
- [ ] All TypeScript errors resolved
- [ ] ESLint passes without errors
- [ ] Components have proper TypeScript types
- [ ] Commit messages follow conventions
- [ ] No unused imports or variables
- [ ] Responsive design works on mobile

## Deployment

### Build Production Bundle

```bash
npm run build
```

Output in `dist/` directory ready for static hosting.

### Preview Production Build

```bash
npm run preview
```

### Deployment Checklist

- [ ] All tests passing
- [ ] Build completes without errors
- [ ] Contract addresses updated for target network
- [ ] Environment-specific configs verified
- [ ] Meta tags and SEO updated
- [ ] Wallet connections tested on target network

## Resources

### Stacks Documentation

- [Stacks.js](https://docs.hiro.so/stacks.js) - Blockchain SDK
- [Clarity Language](https://docs.stacks.co/clarity) - Smart contract language
- [Stacks Explorer](https://explorer.hiro.so/) - Transaction explorer

### Frontend Resources

- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Vite Documentation](https://vitejs.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

### Project-Specific

- `IMPLEMENTATION_GUIDE.md` - Implementation progress and templates
- `README.md` - User-facing documentation
- Contract tests in `../tests/` directory

## Support

For questions or issues:
1. Check this development guide
2. Review existing code examples
3. Consult Stacks.js documentation
4. Open an issue on GitHub

## License

MIT
