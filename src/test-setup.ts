import '@testing-library/jest-dom'
import { vi } from 'vitest'

// jsdom does not implement layout APIs. Stub scrollIntoView so components
// that call it during tests do not throw.
Element.prototype.scrollIntoView = vi.fn()
