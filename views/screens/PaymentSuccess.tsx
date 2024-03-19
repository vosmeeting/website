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
              <p>Here is the weblink for hotel reservation:</p>
              <p>
                <Link url="https://www.hyatt.com/en-US/group-booking/CHIRO/G-GPU0" external>
                  https://www.hyatt.com/en-US/group-booking/CHIRO/G-GPU0
                </Link>
              </p>
              <p>
                <strong>Please do not share this link with non-registrants.</strong> Ensure the name
                on your reservation matches the one on your registration form.
              </p>
            </TextContainer>
          </Card>
          <Card
            sectioned
            primaryFooterAction={goHomeAction}
            secondaryFooterActions={[registerAction]}
          >
            <TextContainer>
              <p>
                <strong>Hotel Reservations:</strong> A discounted room block was contracted for this
                meeting. Block rates are valid for three (3) days pre/post meeting, based on
                availability. Cut-off date for reservations is on <strong>March 5th, 2024</strong>.
                Reservation requests after the cut-off date will be based on availability at Hotel's
                prevailing rates. Cancelled guest rooms after the cut-off date will be returned to
                Hotel's inventory. Name changes on, or other transfers of, room reservations will be
                accepted until 48 hours before arrival.
              </p>
              <p>
                We ask to please book the room through us using our room block if you are staying at
                the venue hotel. We were guaranteed that the room block would be cheaper than any
                3rd party website.
              </p>
              <p>If for some reason the link for hotel reservations does not work you can:</p>
              <List>
                <List.Item>
                  Call the central reservation number at{' '}
                  <Link url="tel:1-800-544-9288">1-800-544-9288</Link>. Our room block is under the
                  group code "G-GPU0". You are able to ask if there is availability to upgrade room
                  types as well.
                </List.Item>
                <List.Item>
                  Email the hotel representative that can help with these matters at{' '}
                  <Link url="mailto:jimmy.viscomi@hyatt.com">jimmy.viscomi@hyatt.com</Link>.
                </List.Item>
              </List>
            </TextContainer>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
};
