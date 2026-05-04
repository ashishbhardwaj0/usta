# usta

How to Access : https://ashishbhardwaj0.github.io/usta/


# CourtMath — User Guide
### An NTRP Dynamic Rating Estimator

---

## What Is CourtMath?

CourtMath estimates your **NTRP dynamic rating** the same way tennisrecord.com does — reverse-engineered from hundreds of real match transitions across players in the Pleasanton/Tri-Valley league. It tells you your match rating for any individual match, and tracks how your dynamic rating evolves across your season.

> **Dynamic rating** is the number tennisrecord shows next to your name — not your certified NTRP level (3.5, 4.0 etc.), but the live floating number that moves after every match. CourtMath predicts this to within **±0.02 NTRP points** for most matches.

---

## Quick Start (3 Steps)

### Step 1 — Enter Your Current Rating
In the **"Your Dyn. Rating"** field, enter your current dynamic rating from your tennisrecord.com profile page. For example: `3.85`

This is the most important input. The match rating formula uses it as a 39% component — without it, accuracy drops significantly.

> **Where to find it:** Go to [tennisrecord.com](https://www.tennisrecord.com), search your name, and look for **"Estimated Dynamic Rating"** at the top of your match history page.

### Step 2 — Fill In the Match
Select **Doubles** or **Singles**, then fill in:

| Field | What to enter |
|---|---|
| Your NTRP Level | Your certified level (3.5, 4.0, 4.5…) |
| Your Dyn. Rating | From tennisrecord — e.g. `3.85` |
| Partner Rating | Your partner's dynamic rating (doubles only) |
| Opponent 1 | First opponent's dynamic rating |
| Opponent 2 | Second opponent's dynamic rating (doubles only) |
| Result | Won or Lost |
| Score | Set by set — e.g. Set 1: `6` – `3`, Set 2: `6` – `4` |

> All ratings are the **dynamic ratings shown in parentheses** on tennisrecord match history pages, not the certified NTRP level.

### Step 3 — Click "Compute & Update Rating →"
That's it. One click does everything:
- Computes your **match rating** for that match
- Adds the match to your **history log**
- Updates your **dynamic rating**
- Shows you how much you played above or below your level

---

## Reading the Results

### Section II — Match Rating
The large number is your **match rating** for that individual match. Below it you'll see the formula breakdown:

```
0.61×opp(4.05) + 0.39×you(3.85) + score adj = 3.94
+0.09 vs your rating · played above level
```

- **opp** = the opponent baseline (opp1 + opp2 − partner for doubles, or just opp for singles)
- **you** = your current dynamic rating going into the match
- **score adj** = bonus/penalty based on game margin (how convincingly you won or lost)
- The second line shows whether you **over-performed or under-performed** relative to your current level

### Section III — Dynamic Rating
This updates every time you log a match. It shows:
- Your **running dynamic rating** to 4 decimal places (e.g. `3.8854`)
- Your **NTRP band** (e.g. `4.0 band` means 3.5001–4.0000)
- A **meter** showing where you sit on the 2.5–5.0 scale

---

## Entering Scores Correctly

Scores are entered from **your perspective** — the games you won in each set.

**Example: You won 6-3, 7-5**
- Set 1: `6` – `3`
- Set 2: `7` – `5`
- Set 3: leave blank

**Example: You lost 4-6, 6-3, 1-0 (super tiebreak)**
- Set 1: `4` – `6`
- Set 2: `6` – `3`
- Set 3: `1` – `0`

> **Super tiebreaks** (the 10-point third-set tiebreak used in most USTA leagues) are entered as `1` – `0` (winner) or `0` – `1` (loser) in the Set 3 field.

---

## Managing Your Match History

### Adding Multiple Matches
Log your matches **chronologically** (oldest first) for the most accurate dynamic rating. Each match feeds into the next via the EMA formula — order matters.

### Removing a Match
**Double-click** any row in the match log to remove it. The dynamic rating recalculates automatically.

### Clearing All History
Click **"↺ Clear match history"** to start fresh. You'll get a confirmation prompt before anything is deleted.

### Data Persistence
Your match history is saved in your **browser's local storage** — it survives page refreshes and closing/reopening the tab. It is **not** synced across devices or browsers. If you open CourtMath in a different browser or incognito mode, you'll start with a clean slate.

---

## Tips for Best Accuracy

**Always enter your rating first.** The formula weights your own rating at 39%. A missing or wrong seed rating will throw off every subsequent calculation.

**Use the rating shown at the time of the match.** Your dynamic rating changes after each match. For historical matches, use the "Rating" column value from the *previous* match on tennisrecord as your seed, not your current rating.

**Log matches in order.** The dynamic rating is a running EMA (exponential moving average). Each match's result becomes the seed for the next. Logging out of order produces incorrect intermediate ratings.

**Doubles: use the ratings shown in parentheses on tennisrecord**, not the certified NTRP level. If a player shows `(-----)` they are self-rated and that match won't compute a valid rating on tennisrecord either.

**Singles is less score-sensitive.** The score adjustment coefficient for singles (0.13) is much lower than doubles (0.74). A 6-0 6-0 singles win only moves the needle about +0.13 NTRP points from the baseline — the *opponent's strength* dominates in singles.

---

## The Algorithm (For the Curious)

CourtMath uses a formula reverse-engineered from 43 sequential match chains across 8 real Pleasanton players (Brian Kuritsubo, Gaurav Anand, Navneet Bhatia, Praveenkumar Davidson, Pravin Lalitha, Ravi Madireddy, Sunny Singh, Thomas Burrill).

### Match Rating
**Doubles:**
```
mr = 0.61 × (opp1 + opp2 − partner) + 0.39 × your_rating + 0.74 × gd_pct
```

**Singles:**
```
mr = 0.61 × opp + 0.39 × your_rating + 0.13 × gd_pct
```

Where `gd_pct = (games_won − games_lost) / total_games`

### Dynamic Rating Update
```
ra_new = 0.20 × match_rating + 0.80 × ra_prev
```

This is a simple **exponential moving average** with α = 0.20, meaning each new match contributes 20% weight to your dynamic rating, and 80% carries forward from your prior rating. Validated against tennisrecord's internal 4-decimal ratings:
- Ravi Madireddy: predicted **3.7233** vs tennisrecord **3.7230** ✓
- Pravin Lalitha: predicted **3.8732** vs tennisrecord **3.8729** ✓

### Accuracy
| Metric | Value |
|---|---|
| Match rating MAE | ~0.02 NTRP points |
| Dynamic rating MAE | ~0.016 NTRP points |
| Within ±0.05 of tennisrecord | ~93% of matches |

---

## Frequently Asked Questions

**Why does my match rating seem low even though I won?**
You played against weaker opponents. The match rating is relative to opponent strength — a 6-0 6-0 win against a 3.20-rated player gives a lower match rating than a tight 7-5 7-5 win against a 4.10-rated player.

**Why did my dynamic rating go down even though I won?**
If your match rating is *below* your current dynamic rating, winning still pulls your average down. For example: if your rating is 3.85 and you win a match with a 3.60 match rating, your dynamic rating will drop slightly toward 3.60.

**What if a partner or opponent shows `(-----)` on tennisrecord?**
That means they're self-rated or unrated. TennisRecord can't compute a match rating for that match, and neither can CourtMath. Skip those matches.

**My rating doesn't match tennisrecord exactly. Why?**
Two reasons: (1) tennisrecord uses internal unrounded match ratings in their EMA, while CourtMath uses the 2-decimal displayed values — rounding error compounds slightly over many matches. (2) The starting seed matters — your true internal seed from 12/31 of the prior year is not publicly visible. Expect ±0.02–0.03 deviation over a full season.

**Does CourtMath work for Mixed doubles and Combo leagues?**
Yes — the same formula applies. Just enter the dynamic ratings shown for each player regardless of league type.

---

## Glossary

| Term | Meaning |
|---|---|
| **Dynamic Rating** | Your live floating NTRP number that changes after each match (e.g. 3.8729) |
| **Certified Rating** | Your fixed NTRP level set at year-end (3.5, 4.0, 4.5 etc.) |
| **Match Rating** | The NTRP performance estimate for a single match |
| **EMA** | Exponential Moving Average — the formula TR uses to blend match ratings into a dynamic rating |
| **α (alpha)** | The EMA weight = 0.20. Each match contributes 20% to your dynamic rating |
| **gd_pct** | Games differential percentage = (gw − gl) / total games |
| **Opp Baseline** | For doubles: opp1 + opp2 − partner. For singles: opp rating |
| **NC** | Not Calculated — tennisrecord shows this when a match is too recent to be computed |
| **S** | Self-rated player involved — tennisrecord and CourtMath can't compute a match rating |

---

*CourtMath is not affiliated with USTA or tennisrecord.com. Ratings are estimates only and have no bearing on official NTRP certification.*
