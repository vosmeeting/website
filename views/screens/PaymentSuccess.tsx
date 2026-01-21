import { Banner, Layout, Page, TextContainer, List, Card, Link } from '@shopify/polaris';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';

export const PaymentSuccess: NextPage = () => {
  const router = useRouter();

  const goHomeAction = {
    content: 'Return to Home Page',
    onAction: () => router.push('/')
  };

  const registerAction = {
    content: 'Register another',
    onAction: () => router.push('/register')
  };

  return (
    <Page>
      <Layout>
        <Layout.Section>
          <Banner title="Your payment was successful!" status="success" />
        </Layout.Section>
        <Layout.Section>
          <Card footerActionAlignment="left" sectioned>
            <TextContainer>
              <p>
                Dear attendees, <br /> thank you for joining us at this year's VOSM! <br />
              </p>
              <p>We hope to have hotel reservation information available soon.</p>
            </TextContainer>
          </Card>
          <Card
            sectioned
            primaryFooterAction={goHomeAction}
            secondaryFooterActions={[registerAction]}
          >
            <TextContainer>
              <p>
                <strong>Hotel Reservations:</strong> Coming Soon
              </p>
            </TextContainer>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
};
