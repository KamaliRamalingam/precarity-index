# The Precarity Index: The Hidden Cost of Unstable Work

An interactive dashboard that ranks 34 European countries on labour precarity, combining in-work poverty, short job tenure, the gender pay gap and working hours into one risk score.

**Solo build · Build for Impact: Labor Rights Data Hackathon (Data & AI Stockholm × Lovable) · May 2026**

### 🔗 [Open the live dashboard](https://precarity-peek.lovable.app/)

## The question

Employment rates alone can make a labour market look healthy. This project asks a different question: **in which countries does having a job still leave people financially insecure, unstable or overworked?**

## The Precarity Index

Each country gets a risk score from 0 to 100, built from four dimensions. Each indicator is normalised to a 0–100 scale across all countries before weighting.

| Dimension | Indicator (Eurostat) | Weight |
|---|---|---|
| **Financial stress** | In-work at-risk-of-poverty rate | 30% |
| **Job insecurity** | Share of employees with short job tenure | 20% |
| **Pay inequality** | Gender pay gap (unadjusted) | 30% |
| **Overwork risk** | Mean weekly hours worked per employee | 20% |

Scores are grouped into four risk bands: **Severe** (65+), **High** (55–64), **Moderate** (40–54) and **Low** (below 40). A fifth dataset, employment rate by sex, is used for gender comparisons and the employment-versus-precarity scatter plot.

## What the dashboard shows

- **Overview:** headline findings, a map of Europe coloured by risk band, and key signals
- **Dimensions:** each of the four dimensions with the EU average, the worst-affected countries and an insight
- **Explorer:** filter by country and switch between weighting lenses to see how priorities change the picture
- **Rankings:** all 34 countries ranked by risk score, with export
- **Methodology:** the formula, weights, normalisation and data sources

**Key insight:** high employment does not guarantee secure work. Some countries combine strong employment rates with high precarity because of pay inequality and job instability.

## Data

Five datasets provided by the hackathon, sourced from Eurostat (including EU-SILC): employed persons by job tenure, employment rate by sex, the unadjusted gender pay gap, the in-work at-risk-of-poverty rate by sex, and mean weekly hours usually worked by sex. The processed country-level data is in [`public/precarity_index.json`](public/precarity_index.json).

## Limitations

- **One snapshot in time.** Each indicator uses the latest available year (2019–2023 depending on the dataset), so countries are compared on slightly different years.
- **The year selector is illustrative.** The dataset covers one period only. The 2021 and 2022 views in Explorer and Rankings apply a fixed scaling to the latest scores rather than real historical data.
- **The weights are judgement calls.** The 30/20/30/20 split reflects the project's focus on financial strain and pay inequality. The Explorer lenses show how the ranking shifts under other weightings.
- **Built in 2.5 hours.** This was a time-boxed hackathon prototype, not a peer-reviewed index.

## Run it locally

```bash
npm install
npm run dev
```

## Built with

React · TypeScript · TanStack Start · Vite · Tailwind CSS · Recharts · react-simple-maps · built with [Lovable](https://lovable.dev)
