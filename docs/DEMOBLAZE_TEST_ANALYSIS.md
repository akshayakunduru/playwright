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

Signing up with a username that already exists. DemoBlaze keeps accounts forever on a public site, so a fixed username usually returns "This user already exist." The tests generate qa_user_<time>_<random> on every run so signup can succeed. They never sign up twice with the same name, so that error is not asserted.

Pagination. The catalog checks only need the first page: Phones, Laptops, Monitors, and Samsung galaxy s6. None of those steps click Next or Previous.

Adding the same product twice. Cart tests add Samsung galaxy s6 once. The total is checked against that one price, then one row is deleted. A second add, and how the total or row count changes, is not part of that flow.

Refreshing the cart page. The cart lives in the browser session. Tests open the cart in that same session and read it. They do not reload cart.html to check that the items are still there.

## Left as manual

- Layout and phone widths. The product cards shift and screenshot checks against this site aren't worth the flakes.
- Payments. Checkout doesn't authorize a card.
- A pass with VoiceOver on the login modal. Faster to do once than to encode.
- Slow network. I looked at it in DevTools. Not something I want in CI.

The above four checks stay manual because automating them would be flaky or would not test anything the site actually does.

Layout and phone widths. The product cards move around on this public site. A screenshot comparison would fail for layout shifts that are not product bugs, so it is not in the suite.

Payments. The checkout form only checks that the name and credit card fields are not blank. It never sends the card to a bank, so there is no payment result to assert. The empty-field alert is already covered in the automated cart test.

VoiceOver on the login modal. That is one manual pass with a screen reader. Encoding the same check is more work than doing it once.

Slow network. Throttling was tried in DevTools. Putting that into CI would make the already slow public site fail more often, so it stays out of the pipeline.
