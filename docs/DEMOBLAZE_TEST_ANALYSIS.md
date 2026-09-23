# DemoBlaze notes

Site: https://www.demoblaze.com

Signup, login, category list, product page, cart, checkout. Messages like "Product added" and "Wrong password." are `window.alert`. The forms are Bootstrap modals. The order confirmation is a SweetAlert (`.sweet-alert`), not an alert.

The cart stays for the session. Tests use one worker so one spec's items don't show up in the next. Usernames are generated on each run. The site is public and a reused name usually hits "This user already exist."

The credit card box only checks that it isn't blank. Nothing here talks to a bank.

## In the suite

| Area | Checked |
| --- | --- |
| Signup | New user, empty username and password |
| Login | Good password, wrong password, unknown user, then logout |
| Catalog | Phones, laptops, monitors, and the Samsung Galaxy s6 title/price |
| Cart | Add, total, delete one row, place order, checkout with name and card left empty |

Not automated: signing up with a username that already exists, pagination, adding the same product twice, refreshing the cart page.

## Left as manual

- Layout and phone widths. The product cards shift and screenshot checks against this site aren't worth the flakes.
- Payments. Checkout doesn't authorize a card.
- A pass with VoiceOver on the login modal. Faster to do once than to encode.
- Slow network. I looked at it in DevTools. Not something I want in CI.
