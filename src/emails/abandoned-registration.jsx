import {
  Body, Button, Container, Head, Heading,
  Html, Preview, Row, Column, Section, Text
} from "@react-email/components";


export default function AbandonedRegistration({ customerName }) {
  const firstName = customerName?.split(" ")[0] ?? "there";

  return (
    <Html>
      <Head />
      <Preview>Don't forget to complete your registration 🌙</Preview>
      <Body style={{ backgroundColor: "#e8e0d5", fontFamily: "Arial, sans-serif" }}>

        {/* TATREEZ TOP */}
        <Section style={{ padding: 0 }}>
          <Row>
            <Column style={{ height: 10, backgroundColor: "#ce1126" }} />
            <Column style={{ height: 10, backgroundColor: "#1a1a1a", width: 20 }} />
            <Column style={{ height: 10, backgroundColor: "#faf7f2" }} />
            <Column style={{ height: 10, backgroundColor: "#1a1a1a", width: 20 }} />
            <Column style={{ height: 10, backgroundColor: "#007a3d" }} />
          </Row>
        </Section>

        <Container style={{ maxWidth: 560, margin: "0 auto" }}>

          {/* HEADER */}
          <Section style={{ backgroundColor: "#faf7f2", padding: "40px 36px 28px", textAlign: "center" }}>
            <Text style={{ fontSize: 10, letterSpacing: 4, textTransform: "uppercase", color: "#999", margin: "0 0 14px" }}>
              Hands of Hope &amp; The Palestinian Cultural Society of BC
            </Text>
            <Heading style={{ fontSize: 42, fontFamily: "Georgia, serif", color: "#1a1a1a", margin: 0, lineHeight: "1.1" }}>
              Eid of{" "}
              <span style={{ color: "#ce1126", fontStyle: "italic" }}>Hope</span>
            </Heading>
            <Text style={{ fontSize: 10, letterSpacing: 4, textTransform: "uppercase", color: "#007a3d", fontWeight: 700, margin: "10px 0 0" }}>
              Community Gathering
            </Text>
          </Section>

          {/* FLAG BAR */}
          <Section style={{ padding: 0 }}>
            <Row>
              <Column style={{ height: 4, backgroundColor: "#1a1a1a" }} />
              <Column style={{ height: 4, backgroundColor: "#d0c9be" }} />
              <Column style={{ height: 4, backgroundColor: "#007a3d" }} />
              <Column style={{ height: 4, backgroundColor: "#ce1126" }} />
            </Row>
          </Section>

          {/* EVENT INFO */}
          <Section style={{ backgroundColor: "#007a3d", padding: "14px 36px", textAlign: "center" }}>
            <Row>
              <Column style={{ paddingRight: 32 }}>
                <Text style={{ color: "#fff", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, lineHeight: "1.5", margin: 0 }}>
                  📅 APRIL 6<br />DOORS @ 3:00 PM
                </Text>
              </Column>
              <Column>
                <Text style={{ color: "#fff", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, lineHeight: "1.5", margin: 0 }}>
                  📍 MAC VANCOUVER<br />2122 KINGSWAY
                </Text>
              </Column>
            </Row>
          </Section>

          {/* BODY */}
          <Section style={{ backgroundColor: "#faf8f3", padding: "40px 40px 32px" }}>
            <Heading as="h2" style={{ fontSize: 22, fontFamily: "Georgia, serif", color: "#1a1a1a", margin: "0 0 18px" }}>
              Hello{" "}
              <span style={{ color: "#ce1126" }}>{firstName}</span>,
            </Heading>

            <Text style={{ fontSize: 15, lineHeight: "1.8", color: "#4a4a4a", margin: "0 0 14px" }}>
              We noticed you started your registration for <strong>Eid of Hope</strong> but didn't quite make it to checkout.
            </Text>

            {/* Highlight card */}
            <Section style={{ backgroundColor: "#f5fbf7", borderLeft: "4px solid #007a3d", padding: "16px 20px", margin: "22px 0" }}>
              <Text style={{ margin: 0, fontSize: 14, color: "#1a3a2a", fontStyle: "italic" }}>
                🤍 Your spot is still waiting — we'd love to celebrate this joyful occasion together as a community.
              </Text>
            </Section>

            {/* Pricing */}
            <Section style={{ backgroundColor: "#1a1a1a", borderRadius: 10, padding: "14px 20px", margin: "18px 0 24px", textAlign: "center" }}>
              <Text style={{ color: "#fff", fontSize: 14, fontWeight: 700, letterSpacing: 1, margin: 0 }}>
                <span style={{ color: "#ce1126" }}>$15</span> Adults
                <span style={{ color: "#007a3d", margin: "0 12px" }}>|</span>
                <span style={{ color: "#ce1126" }}>$10</span> Kids
              </Text>
            </Section>

            {/* CTA Button */}
            <Section style={{ textAlign: "center", margin: "28px 0 22px" }}>
              <Button
                href="https://www.handsofhopeorg.ca/eid-of-hope/register"
                style={{
                  backgroundColor: "#ce1126",
                  color: "#fff",
                  fontFamily: "Arial, sans-serif",
                  fontSize: 14,
                  fontWeight: 700,
                  letterSpacing: 1.5,
                  textTransform: "uppercase",
                  padding: "16px 42px",
                  borderRadius: 50,
                  textDecoration: "none",
                }}
              >
                Complete My Registration
              </Button>
            </Section>

            <Text style={{ fontSize: 13, color: "#999", textAlign: "center", fontStyle: "italic" }}>
              Having trouble with payment? Reply to this email — we're here to help 💌
            </Text>

            <Text style={{ fontSize: 15, fontFamily: "Georgia, serif", color: "#1a1a1a", margin: "26px 0 4px" }}>
              Looking forward to seeing you,
            </Text>
            <Text style={{ fontSize: 13, color: "#888", margin: 0 }}>
              Eid of Hope Team
            </Text>
          </Section>

          {/* FOOTER */}
          <Section style={{ backgroundColor: "#1a1a1a", padding: "22px 36px", textAlign: "center" }}>
            <Text style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", lineHeight: "1.6", margin: 0 }}>
              Questions?{" "}
              <a href="mailto:tickets@handsofhopeorg.ca" style={{ color: "#ce1126", textDecoration: "none" }}>
                tickets@handsofhopeorg.ca
              </a>
            </Text>
          </Section>

        </Container>

        {/* TATREEZ BOTTOM */}
        <Section style={{ padding: 0 }}>
          <Row>
            <Column style={{ height: 10, backgroundColor: "#ce1126" }} />
            <Column style={{ height: 10, backgroundColor: "#1a1a1a", width: 20 }} />
            <Column style={{ height: 10, backgroundColor: "#faf7f2" }} />
            <Column style={{ height: 10, backgroundColor: "#1a1a1a", width: 20 }} />
            <Column style={{ height: 10, backgroundColor: "#007a3d" }} />
          </Row>
        </Section>

      </Body>
    </Html>
  );
}