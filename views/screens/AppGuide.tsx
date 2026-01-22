import {
  Card,
  DescriptionList,
  Heading,
  Layout,
  List,
  Page,
  Subheading,
  TextContainer
} from '@shopify/polaris';

export function AppGuide() {
  return (
    <Page narrowWidth>
      <Layout>
        <Layout.Section>
          <Card sectioned>
            <TextContainer spacing="loose">
              <Heading>APPLICATION GUIDE FOR EXHIBITION</Heading>
              <p>Coming Soon</p>
            </TextContainer>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
