# XL Arms Storefront - Client Integration Guide

## Overview

The XL Arms storefront is now fully functional and ready for your RSR inventory. This guide outlines the integration points where you'll need to provide specific information and credentials to complete the setup.

## ✅ What's Complete

### Core E-commerce Features
- **Product Listing Page** (`/store`)
  - Grid display with product cards
  - Search functionality
  - Category and manufacturer filters
  - Pagination and "Load More" functionality
  - Real-time stock status display

- **Product Detail Pages** (`/store/[stockNumber]`)
  - Full product information display
  - Image gallery with fallbacks
  - Quantity selector
  - "Add to Cart" and "Buy Now" buttons
  - Detailed specifications (caliber, capacity, barrel length, etc.)

- **Shopping Cart** (`/cart`)
  - Add/remove items
  - Quantity adjustment
  - Price calculations
  - Persistent storage (survives page refreshes)
  - Mobile-responsive design

- **Checkout Flow** (`/checkout`)
  - Contact information collection
  - Shipping address form
  - Billing address (optional separate address)
  - Form validation with error messages
  - Age verification checkbox
  - Terms and conditions acceptance

- **Navigation**
  - Consistent header across all pages
  - Cart badge showing item count
  - Responsive mobile menu

- **Legal Pages**
  - Terms and Conditions (`/terms`)
  - Privacy Policy (`/privacy`)
  - Shipping Policy (`/shipping`)

## 🔌 Integration Points (Action Required)

### 1. Payment Gateway Integration

**Location**: `/src/app/checkout/page.tsx` (lines ~200-220)

**What's Needed**:
- Payment provider credentials (Stripe, Square, or other)
- API keys (public and secret)
- Webhook configuration

**Recommended Provider**: Stripe
- Easy integration
- PCI compliance handled
- Excellent documentation
- Support for various payment methods

**Environment Variables to Add**:
```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

**Documentation**: See `PAYMENT_INTEGRATION.md` (to be created once you select provider)

---

### 2. Shipping Provider Integration

**Location**: `/src/app/shipping/page.tsx` (placeholder content)

**What's Needed**:
- Preferred shipping carrier(s): UPS, FedEx, USPS, or combination
- Shipping account credentials
- Rate calculation preferences:
  - Flat rate
  - Calculated by weight/distance
  - Free shipping threshold
  - Separate rates for firearms vs accessories

**Recommended Providers**:
- **ShipStation**: Multi-carrier platform with excellent API
- **EasyPost**: Developer-friendly, supports multiple carriers
- **Direct carrier APIs**: UPS, FedEx (more complex but lower fees)

**Environment Variables to Add**:
```env
SHIPSTATION_API_KEY=...
SHIPSTATION_API_SECRET=...
# OR
EASYPOST_API_KEY=...
```

**State Restrictions**: You'll need to provide a list of states/localities where certain items cannot be shipped.

---

### 3. FFL Dealer Database

**Location**: `/src/app/checkout/page.tsx` (lines ~250-270)

**What's Needed**:
- FFL dealer database access or API
- Criteria for dealer verification
- Process for adding new FFL dealers

**Options**:
1. **Custom Database**: Build your own verified FFL dealer list
2. **Third-party Service**: FFL123, GunBroker API, or similar
3. **Manual Entry**: Customers provide FFL info, you verify before shipment

**Recommended Approach**: 
- Use a searchable database with zip code lookup
- Allow customers to suggest new dealers
- Verify all dealers before first use

---

### 4. Tax Calculation

**Location**: `/src/app/cart/page.tsx` (line ~44) and `/src/app/checkout/page.tsx` (line ~142)

**Current State**: Placeholder 8% flat tax

**What's Needed**:
- Tax calculation service or rules by state/locality
- Nexus information (states where you have tax presence)

**Recommended Services**:
- **TaxJar**: Automatic sales tax calculation
- **Avalara**: Enterprise-grade tax compliance
- **Stripe Tax**: If using Stripe for payments

**Environment Variables to Add**:
```env
TAXJAR_API_KEY=...
# OR configure state-by-state rules
```

---

### 5. Email Notifications

**Location**: Order confirmation emails (needs implementation)

**What's Needed**:
- Email service provider credentials
- Email templates for:
  - Order confirmation
  - Shipping notification
  - FFL transfer instructions
  - Order status updates

**Recommended Provider**: Resend
- Modern API
- React email templates
- Great deliverability
- Generous free tier

**Environment Variables to Add**:
```env
RESEND_API_KEY=re_...
FROM_EMAIL=orders@xlarms.us
```

---

### 6. Compliance & Legal

**What's Needed**:

1. **Legal Review**:
   - Have an attorney review all terms and conditions
   - Ensure ATF compliance for your specific state
   - Review privacy policy for CCPA/GDPR if applicable

2. **Age Verification Service** (recommended for launch):
   - Options: Onfido, Jumio, ID.me
   - Integrates during checkout
   - Verifies government-issued ID

3. **Background Check Process**:
   - Define your process for coordinating with FFL dealers
   - 4473 form handling
   - Record retention policy (ATF requires 20 years)

4. **State Restrictions**:
   - List of prohibited products by state
   - Magazine capacity limits
   - Assault weapon bans
   - Ammo restrictions

**Files to Update**:
- `/src/app/terms/page.tsx`
- `/src/app/privacy/page.tsx`
- `/src/app/shipping/page.tsx`

---

### 7. Database Configuration (Already in Progress)

**Current State**: RSR integration API endpoints are built

**What's Needed**:
- Vercel KV (Redis) credentials - for product data
- Vercel Postgres credentials - for orders and customers

**Environment Variables**:
```env
# Already configured for RSR
RSR_FTP_HOST=...
RSR_FTP_USER=...
RSR_FTP_PASSWORD=...

# Needs setup
KV_REST_API_URL=...
KV_REST_API_TOKEN=...
POSTGRES_URL=...
```

---

## 📋 Launch Checklist

### Before Going Live:

- [ ] Set up Vercel KV and Postgres databases
- [ ] Configure payment gateway (Stripe recommended)
- [ ] Set up shipping provider (ShipStation recommended)
- [ ] Implement tax calculation (TaxJar or Stripe Tax)
- [ ] Set up email service (Resend)
- [ ] Legal review of all terms and policies
- [ ] Age verification service integration
- [ ] FFL dealer database or search functionality
- [ ] State restriction rules implementation
- [ ] Test complete purchase flow end-to-end
- [ ] Set up monitoring and error tracking (Sentry)
- [ ] Configure SSL certificate (handled by Vercel)
- [ ] Set up domain name and DNS

### Security Checklist:

- [ ] All API keys stored as environment variables
- [ ] HTTPS enforced on all pages
- [ ] Payment processing PCI compliant
- [ ] Customer data encrypted at rest
- [ ] Regular security audits
- [ ] Rate limiting on API endpoints
- [ ] CAPTCHA on forms to prevent bots

---

## 🎨 Customization Options

### Branding
All colors can be customized in `tailwind.config.ts`:
- Primary: Amber (#F59E0B)
- Background: Gray-900 (#111827)
- Cards: Gray-800 (#1F2937)

### Product Display
- Adjust products per page: Edit `pageSize` in `/src/app/store/page.tsx`
- Modify search filters: Update filter options in store page
- Change product card layout: Edit ProductCard component

### Pricing Strategy
Current setup shows wholesale price from RSR. You can:
- Add markup percentage globally
- Implement category-based pricing
- Set up sale/promotion pricing
- Add member/wholesale tiers

---

## 📞 Next Steps

1. **Schedule Integration Meeting**: Review this document and prioritize integrations
2. **Provide Credentials**: Share API keys and account information for selected services
3. **Legal Review**: Send legal pages to attorney for review
4. **Testing**: We'll set up a staging environment for testing
5. **Launch**: Go live with full e-commerce functionality!

---

## 🛠️ Technical Support

For technical questions during integration:
- Review Next.js documentation: https://nextjs.org/docs
- Stripe integration guide: https://stripe.com/docs/payments/quickstart
- Contact development team for assistance

---

## 📊 Current Features Summary

| Feature | Status | Notes |
|---------|--------|-------|
| Product Listing | ✅ Complete | Connected to RSR API |
| Product Details | ✅ Complete | Full specifications display |
| Shopping Cart | ✅ Complete | Persistent storage |
| Search & Filters | ✅ Complete | Category, manufacturer, in-stock |
| Checkout Form | ✅ Complete | Validation ready |
| Payment Gateway | 🔌 Ready for Integration | Awaiting credentials |
| Shipping Calculator | 🔌 Ready for Integration | Awaiting provider selection |
| Tax Calculation | 🔌 Ready for Integration | Currently using placeholder |
| Email Notifications | 🔌 Ready for Integration | Awaiting email service |
| FFL Selection | 🔌 Ready for Integration | Awaiting database/API |
| Age Verification | 🔌 Ready for Integration | Recommended for launch |
| Legal Pages | ⚠️ Needs Content | Templates provided |

---

**Last Updated**: [Current Date]
**Development Status**: Ready for Client Integration
**Estimated Time to Launch**: 2-3 weeks after receiving integration details
