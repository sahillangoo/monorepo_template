# AGENTS.md - E-commerce Monorepo Development Guide

e-commerce application built with the modern turbo monorepo architecture.

## Key Features of the Guide

**Project Architecture Overview**[1][2][3]

- Complete setup with Bun, Hono, Vite, Next.js, Prisma, PostgreSQL, and Better Auth
- Turborepo monorepo structure with clear separation of frontend and backend
- Payment integration with Stripe, PhonePe, and Razorpay[4][5][6]

**Development Standards**[7][1]

- DRY and KISS principles enforcement
- TypeScript strict mode configuration
- Clean, readable, consistent, and performant code requirements
- Proper commenting and documentation standards

**Comprehensive Code Examples**[8][9][10]

- Database schema with Prisma models for users, products, and orders
- Better Auth configuration for secure authentication
- Hono API routes with Zod validation and Swagger documentation
- Next.js components using DaisyUI and Tailwind CSS with font classes

**SEO and Performance Optimization**[11][12][13]

- Next.js 14+ SEO best practices with metadata generation
- Server-side rendering and static site generation strategies
- Image optimization and Core Web Vitals considerations
- Scalable architecture for high-traffic e-commerce platforms[14][15][16]

**Self-Hosting and Deployment**[17][18]

- Docker configuration for containerized deployment
- Environment variables setup for all services
- Security best practices and monitoring guidelines
- CI/CD pipeline recommendations

**Payment Gateway Integration**[5][4]

- Multi-payment provider interface design
- Support for Indian payment methods (UPI, net banking, cards)
- Secure payment processing with proper error handling

[1] https://ampcode.com/agent.md
[2] https://github.com/eastlondoner/vibe-tools
[3] https://experienceleague.adobe.com/en/docs/commerce-learn/tutorials/global-reference-architecture-implementation-techniques/monorepo
[4] https://qrolic.com/blog/stripe-vs-razorpay-comparison/
[5] https://elextensions.com/best-payment-gateways-india-recurring-payments/
[6] https://paynet.co.in/index.php/2025/04/29/how-payment-gateways-protect-customer-data-cloned-1080/
[7] https://docs.cursor.com/context/rules-for-ai
[8] https://dev.to/daanish2003/email-and-password-auth-using-betterauth-nextjs-prisma-shadcn-and-tailwindcss-hgc
[9] https://www.prisma.io/docs/guides/betterauth-nextjs
[10] https://vercel.com/guides/nextjs-prisma-postgres
[11] https://reliasoftware.com/blog/nextjs-ecommerce-optimization-for-better-seo-and-performance
[12] https://www.qed42.com/insights/seo-strategies-for-next-js-14-and-typescript-building-search-optimised-websites
[13] https://strapi.io/blog/nextjs-seo
[14] https://aws.amazon.com/blogs/architecture/architecting-a-highly-available-serverless-microservices-based-ecommerce-site/
[15] https://roadmap.sh/projects/scalable-ecommerce-platform
[16] https://virtocommerce.com/blog/scalable-ecommerce-architecture
[17] https://uideck.com/blog/self-hosted-ecommerce-solutions
[18] https://www.tribe-ecommerce.com/blog/best-self-hosted-ecommerce-platforms/
[20] https://gist.github.com/planetis-m/f28c1ce360f4a42d37ca0f1702d8e305
[21] https://www.aviator.co/blog/monorepo-a-hands-on-guide-for-managing-repositories-and-microservices/
[22] https://docs.cursor.com/agent
[23] https://lucapette.me/writing/how-to-structure-a-monorepo/
[24] https://agentsmd.net
[25] https://dev.to/katya_pavlopoulos/how-i-built-an-app-with-cursor-ai-agent-for-the-first-time-the-good-the-bad-and-the-drama-168o
[26] https://circleci.com/blog/monorepo-dev-practices/
[27] https://platform.openai.com/docs/codex/overview
[28] https://www.youtube.com/watch?v=tm94DULupNc
[29] https://www.digitalocean.com/community/tutorials/how-to-containerize-monorepo-apps
[30] https://www.linkedin.com/pulse/mastering-codex-agent-configuration-files-complete-lozovsky-mba-zyh8c
[31] https://docs.cursor.com/background-agent
[32] https://www.toptal.com/front-end/guide-to-monorepos
[33] https://www.reddit.com/r/ArtificialInteligence/comments/1kw16yi/a_comprehensive_list_of_agentrule_files_do_we/
[34] https://apidog.com/blog/cursor-ai-agents/
[35] https://www.youtube.com/watch?v=BSrd_rU0Ioo
[36] https://articles.wesionary.team/next-js-theming-and-storybook-with-tailwindcss-daisyui-part-1-779348e9db08
[37] https://www.reddit.com/r/reactjs/comments/1l3y29h/best_structure_for_hono_react/
[38] https://github.com/m19e/next-daisyui-template
[39] https://dev.to/0xahmad/running-both-nodejs-and-bun-apps-in-turborepo-33id
[40] https://daisyui.com/docs/install/nextjs/?lang=en
[41] https://www.youtube.com/watch?v=C-hEgl_F6lE
[42] https://www.reddit.com/r/nextjs/comments/1kllpsv/better_auth_full_tutorial_with_nextjs_prisma_orm/
[43] https://www.youtube.com/watch?v=th8OswsAq6Q
[44] https://www.youtube.com/watch?v=jXyTIQOfTTk
[45] https://www.youtube.com/watch?v=N4meIif7Jtc
[46] https://daisyui.com
[47] https://dev.to/lico/react-monorepo-setup-tutorial-with-pnpm-and-vite-react-project-ui-utils-5705
[48] https://www.better-auth.com/docs/adapters/prisma
[49] https://www.youtube.com/watch?v=g12_6l53uMM
[50] https://bun.sh/guides/ecosystem/nextjs
[51] https://www.youtube.com/watch?v=N1BBFuUQo4M
[52] https://www.binshops.com/docs/next-ecommerce/
[53] https://github.com/evershopcommerce/evershop/issues/667
[54] https://www.amarinfotech.com/phonepe-payment-gateway-integration.html
[55] https://nextjstemplates.com/blog/best-nextjs-ecommerce-templates
[56] https://developers.google.com/learn/pathways/solution-ecommerce-microservices-kubernetes
[57] https://qikink.com/blog/best-payment-gateways-india/
[58] https://nextjs.org/learn/seo
[59] https://strapi.io/blog/ecommerce-microservices-architecture-benefits-guide
[60] https://stripe.com/in/payments/features
