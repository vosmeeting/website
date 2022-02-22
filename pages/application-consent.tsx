import { Card, Heading, Layout, List, Page, Subheading, TextContainer } from '@shopify/polaris'

export default function AppConsent() {
	return (
		<Page narrowWidth>
			<Layout>
				<Layout.Section>
					<Card sectioned>
						<TextContainer spacing='loose'>

							<Heading>APPLICATION CONSENT</Heading>
							<Subheading>
								This Application for Commercial Exhibits and
								Sponsorships is a contract. By submitting this
								application, you agree to the following:

							</Subheading>

							<List>
								<List.Item>
									<p>
										Registration fee is due immediately upon
										registration and submission of the
										Application Form in order to secure a booth
										and qualify for the rates listed. After
										5/15, a late fee of $250 will be charged for
										exhibitor registration.
									</p>
								</List.Item>
								<List.Item>
									<p>
										All booth space is assigned by the
										organizing committee. Preference will be
										given to sponsors; subsequently to all
										exhibiting companies. We will do our best to
										separate companies that are competitors and
										to comply with location preferences;
										however, we reserve the right to change the
										floor plan or booth assignments at any time.
									</p>
								</List.Item>
								<List.Item>
									Submission of this form does not guarantee booth
									reservation. A confirmation email will be sent
									acknowledging receipt of the form and payment.
								</List.Item>
								<List.Item>
									Cancellation Policy: Cancellations must be
									received via e-mail. Requests received prior to
									May 1st will receive a refund minus a 25%
									administrative charge (or if the event is
									canceled due to COVID at any time). Requests
									received between May 2nd-Jun 1st will receive a
									50% refund. Refunds will not be granted on or
									after Jun 1st.
								</List.Item>
								<List.Item>
									If a no-show is COVID-related, a 50% refund of
									registration fees can be applied upon proof of +
									COVID test for the rep listed in the
									registration form in the week leading up to the
									event (7 days before the first day of the
									event). Sponsorships are not refundable, only
									registration fees are eligible for refunds. We
									assume no responsibility for having included the
									name of the canceled exhibitor in conference
									materials.
								</List.Item>
								<List.Item>
									The organizing company ("MDVM Solutions") and
									any of its representatives or contractors will
									not be responsible for any injury, loss or
									damage that may occur to the exhibitor, their
									employees or exhibit materials from any cause
									whatsoever, either prior to, during, or after
									the show/conference. The organizing company
									("MDVM Solutions") and any of its
									representatives or contractors will not be
									responsible if any exhibitor acquires a COVID
									infection during the event, whether or not the
									exhibitor applied the recommended safety
									protocols by all the respective official state
									and federal bodies. By signing this form the
									exhibiting company expressly releases the
									organizing company ("MDVM Solutions") from such
									liabilities.
								</List.Item>
								<List.Item>
									Any changes may require resubmission of the
									entire form.
								</List.Item>
							</List>

						</TextContainer>
					</Card>
				</Layout.Section>
			</Layout>
		</Page>
	)
}
