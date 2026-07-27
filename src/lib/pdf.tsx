import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
  renderToBuffer,
} from "@react-pdf/renderer";
import type { GuideResult } from "@/lib/types";
import { site } from "@/data/config";

// Landart-branded result PDF (Build Spec sections 7 & 9).
// Brand rules: square corners (no border radius), flat surfaces (no shadows/gradients),
// charcoal and gold. @react-pdf ships Helvetica; we keep a clean sans to echo Montserrat.

const COLORS = {
  charcoal: "#363636",
  gold: "#c5a47e",
  page: "#ece9e3",
  panel: "#faf8f4",
  muted: "#8a8680",
  hairline: "#d8d4cc",
  white: "#ffffff",
};

const styles = StyleSheet.create({
  page: {
    backgroundColor: COLORS.page,
    paddingTop: 48,
    paddingBottom: 56,
    paddingHorizontal: 44,
    fontFamily: "Helvetica",
    color: COLORS.charcoal,
    fontSize: 10,
    lineHeight: 1.5,
  },
  hero: {
    backgroundColor: COLORS.charcoal,
    color: COLORS.white,
    padding: 24,
    marginBottom: 22,
  },
  wordmark: {
    fontFamily: "Helvetica-Bold",
    fontSize: 16,
    letterSpacing: 3,
    color: COLORS.white,
    marginBottom: 10,
  },
  logo: {
    height: 26,
    marginBottom: 12,
    objectFit: "contain",
    alignSelf: "flex-start",
  },
  heroLabel: {
    fontSize: 8,
    letterSpacing: 2,
    color: COLORS.gold,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  heroName: {
    fontFamily: "Helvetica-Bold",
    fontSize: 22,
    color: COLORS.white,
  },
  sectionLabel: {
    fontSize: 8,
    letterSpacing: 2,
    color: COLORS.gold,
    textTransform: "uppercase",
    marginBottom: 8,
    marginTop: 18,
  },
  paragraph: { marginBottom: 8, color: COLORS.charcoal },
  materials: { color: COLORS.muted, marginBottom: 4 },
  itemRow: {
    borderTopWidth: 1,
    borderTopColor: COLORS.hairline,
    borderStyle: "solid",
    paddingVertical: 7,
  },
  itemName: { fontFamily: "Helvetica-Bold", fontSize: 11, color: COLORS.charcoal },
  itemBotanical: { fontSize: 8, color: COLORS.muted, fontStyle: "italic", marginBottom: 2 },
  itemNote: { color: COLORS.charcoal },
  panel: {
    backgroundColor: COLORS.panel,
    borderLeftWidth: 2,
    borderLeftColor: COLORS.gold,
    borderStyle: "solid",
    padding: 14,
    marginTop: 6,
  },
  linkItem: { color: COLORS.charcoal, marginBottom: 3 },
  linkUrl: { color: COLORS.muted, fontSize: 8 },
  ctaBox: {
    backgroundColor: COLORS.gold,
    padding: 16,
    marginTop: 20,
  },
  ctaHeading: { fontFamily: "Helvetica-Bold", fontSize: 12, color: COLORS.charcoal, marginBottom: 4 },
  ctaText: { color: COLORS.charcoal },
  footer: {
    position: "absolute",
    bottom: 24,
    left: 44,
    right: 44,
    borderTopWidth: 1,
    borderTopColor: COLORS.hairline,
    borderStyle: "solid",
    paddingTop: 8,
    fontSize: 7,
    color: COLORS.muted,
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

function GuidePdf({
  result,
  name,
  logo,
}: {
  result: GuideResult;
  name: string;
  logo?: string;
}) {
  return (
    <Document
      title={`Landart Garden Concept — ${result.style.name}`}
      author="Landart"
      subject="Your tailored Sydney garden concept"
    >
      <Page size="A4" style={styles.page}>
        <View style={styles.hero}>
          {logo ? (
            // eslint-disable-next-line jsx-a11y/alt-text
            <Image src={logo} style={styles.logo} />
          ) : (
            <Text style={styles.wordmark}>LANDART</Text>
          )}
          <Text style={styles.heroLabel}>Your Garden Concept Direction</Text>
          <Text style={styles.heroName}>{result.style.name}</Text>
        </View>

        {name ? (
          <Text style={styles.paragraph}>
            {name}, here is the concept direction shaped around your answers. It is a
            starting point for a conversation, not a finished plan.
          </Text>
        ) : null}

        <Text style={styles.sectionLabel}>The Direction</Text>
        <Text style={styles.paragraph}>{result.style.summary}</Text>
        <Text style={styles.materials}>Materials & palette: {result.style.materials}</Text>

        <Text style={styles.sectionLabel}>Planting Palette</Text>
        {result.plants.map((p, i) => (
          <View key={i} style={styles.itemRow}>
            <Text style={styles.itemName}>{p.name}</Text>
            <Text style={styles.itemBotanical}>{p.botanical}</Text>
            <Text style={styles.itemNote}>{p.note}</Text>
          </View>
        ))}

        <Text style={styles.sectionLabel}>Suggested Features</Text>
        {result.features.map((f, i) => (
          <View key={i} style={styles.itemRow}>
            <Text style={styles.itemName}>{f.name}</Text>
            <Text style={styles.itemNote}>{f.note}</Text>
          </View>
        ))}

        <Text style={styles.sectionLabel}>On Upkeep</Text>
        <View style={styles.panel}>
          <Text>{result.maintenanceNote}</Text>
        </View>

        {result.links.length > 0 ? (
          <>
            <Text style={styles.sectionLabel}>See It In Our Work</Text>
            {result.links.map((l, i) => (
              <View key={i}>
                <Text style={styles.linkItem}>{l.label}</Text>
                <Text style={styles.linkUrl}>{l.url}</Text>
              </View>
            ))}
          </>
        ) : null}

        <View style={styles.ctaBox}>
          <Text style={styles.ctaHeading}>Ready to talk it through?</Text>
          <Text style={styles.ctaText}>
            Book a consult and we will turn this direction into a design for your
            space. {site.contactUrl}
          </Text>
        </View>

        <View style={styles.footer} fixed>
          <Text>Landart — Garden design, Sydney Eastern Suburbs & Northern Beaches</Text>
          <Text>{site.landartUrl.replace(/^https?:\/\//, "")}</Text>
        </View>
      </Page>
    </Document>
  );
}

/**
 * Render the result to a PDF Buffer for emailing/attaching.
 * `logo` is an optional data URI (or URL) for the Landart logo; omit to use the text wordmark.
 */
export async function renderResultPdf(
  result: GuideResult,
  name: string,
  logo?: string,
): Promise<Buffer> {
  return renderToBuffer(<GuidePdf result={result} name={name} logo={logo} />);
}
