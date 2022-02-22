import {
    Card,
    DescriptionList,
    Heading,
    Layout,
    List,
    Page,
    Subheading,
    TextContainer,
    TextStyle,
} from '@shopify/polaris'

export default function AppConsent() {
    return (
        <Page narrowWidth>
            <Layout>
                <Layout.Section>
                    <Card sectioned>
                        <TextContainer spacing="loose">
                            <Heading>APPLICATION GUIDE FOR EXHIBITION</Heading>
                            <Subheading>
                                Booth Types, Space, Construction & Sizes
                            </Subheading>
                            <p>
                                This is a TABLE-TOP show only. One 2’ x 6’
                                draped display table per booth (table sizes may
                                vary slightly) will be supplied. Encroachment is
                                not allowed. Exhibits and displays must be
                                confined to the rented space (8’W x 6’D,
                                includes side clearance). The maximum height of
                                a table top display is 8’ at the back of the
                                booth and 4’ in the front half of the booth
                                space. Exhibits may not exceed these parameters.
                                <span className="underline">
                                    The room we will be using has a ceiling
                                    height of 8.5ft
                                </span>
                                . The aisles are common property of all
                                exhibitors and must not be obstructed at any
                                time. Fire code regulations prohibit exhibits
                                from extending into aisles. A freestanding
                                backdrop may be used (not to extend more than 8’
                                in total width), or a banner may be attached to
                                the front of the table. Booth signage is not
                                provided. The hotel will not allow signage to
                                hang on the walls. Booths do not include
                                decorations or utilities such as internet,
                                signage, electrical outlets, special lighting or
                                water. Furnishings and accessories beyond what
                                is listed are not included. Pipe and drape may
                                not be provided, depending on facility
                                configuration. If you have any questions please
                                contact the hotel (Hyatt Regency O’hare)
                            </p>
                            <Subheading>
                                Installation and Dismantling of Exhibits
                            </Subheading>
                            <p>
                                Exhibitor sign up and setup will be from 3-6pm
                                Friday. The welcome reception will take place at
                                the exhibitor hall (from 6- 9pm). We recommend
                                exhibit hall booths be operational by 6pm.
                                Exhibitor hours are elective during the
                                reception Friday night, although it’s highly
                                advised being present. Exhibitor hours during
                                the meeting is: 8-6pm Saturday, 8-12pm Sunday.
                                Tear down of exhibitors will take place after
                                the last morning lecture on Sunday. Exhibits
                                must be off the floor by 6pm Sunday. We have
                                secured the meeting space until Sunday,
                                therefore early tear down or removal of
                                merchandise overnight or after the first day of
                                installation and before dismantling time is
                                discouraged.
                            </p>
                            <p>
                                Contact representative at the Hyatt Regency
                                O’hare: If you have any questions about
                                installation, dismantling, shipping, receiving
                                or anything else related to the hotel, please do
                                not hesitate to contact our meeting planner this
                                year, Katie Ruggiero:{' '}
                                <b>katie.ruggiero@hyatt.com</b>
                            </p>
                            <Subheading>
                                Reception appetizers, breakfast and lunch:
                            </Subheading>
                            <p>
                                Both are included in the registration fee,
                                however exhibitors may choose to eat at the
                                hotel establishments as well. Lunch cannot be
                                delivered separately to the booths in this hotel
                                per union service rules. A ticketing system may
                                be used. Exhibitors will be given a free drink
                                ticket per person during the reception, which
                                will host a cash bar and hopefully a live Jazz
                                band again.
                            </p>
                            <Subheading>
                                Booth Service Agreement form:
                            </Subheading>
                            <p>
                                The booth Service agreement form was provided
                                along with this registration form. Such form
                                covers the hotel’s rules and regulations,
                                shipping/receiving guidelines for all packages
                                coming in for groups, also the ordering form for
                                individual companies to purchase power and A/V
                                services for the booths.{' '}
                                <b>
                                    Please send/fax the booth service agreement
                                    form to the hotel and not to us. Do not
                                    hesitate to contact the hotel if you have
                                    questions or concerns regarding shipping or
                                    other related factors.
                                </b>
                            </p>

                            <Subheading>Room Rates & Reservations:</Subheading>
                            <p>
                                Once we have the hotel room link for booking
                                with our discounted rates, we will send it for
                                all registered exhibitors. This will be
                                available until registration opens to attendees,
                                then these spaces may quickly sell out. It is
                                recommended exhibitors book a room and cancel
                                later to be safe.
                            </p>
                            <Subheading>SPONSORSHIP LEVELS</Subheading>
                            <p>
                                company logos will be shown on screen during
                                breaks, oral acknowledgement to these sponsors
                                will be given daily during the conference
                            </p>
                            <DescriptionList
                                items={[
                                    {
                                        term: 'Prime',
                                        description:
                                            '$6000 (includes 50% off the price of one booth)',
                                    },
                                    {
                                        term: 'Platinum',
                                        description:
                                            '$5000 (includes 40% off the price of one booth)',
                                    },
                                    {
                                        term: 'Gold',
                                        description:
                                            '$4000 (includes 30% off the price of one booth)',
                                    },
                                    {
                                        term: 'Silver',
                                        description:
                                            '$3000 (includes 20% off the price of one booth)',
                                    },
                                    { term: 'Bronze', description: '$2000 ' },
                                ]}
                            />
                            <p> Advantages of being a sponsor: </p>
                            <p>
                                Sponsors' logos will be shown on a few different
                                locations during the event:
                            </p>
                            <List type="number"></List>
                            <List.Item>in the slides during breaks,</List.Item>
                            <List.Item>
                                in banners placed at the meeting hall and
                            </List.Item>
                            <List.Item>
                                In the proceedings book, at the "thank you
                                sponsors" page.
                                <p>
                                    Additionally, oral acknowledgement will be
                                    given daily to our sponsors during the
                                    conference. All sponsorships (except the
                                    BRONZE) come with a discount in the booth
                                    fee, proportional to the type of sponsorship
                                    (see first page). The sponsors will have
                                    priority in selecting booths in the next
                                    event, in the order of sponsorship value.
                                </p>{' '}
                            </List.Item>
                            <b>
                                {' '}
                                This year we will ad the sponsors logos in the
                                registration website as well.{' '}
                            </b>
                            <Subheading>
                                GENERAL SUPPORT (acknowledgement to these
                                sponsors will be given daily during the
                                conference and company logos will be shown on
                                screen during breaks)
                            </Subheading>
                            <List>
                                <List.Item>
                                    *Reception drinks, Reception Live Jazz
                                    Band*, Reception appetizers, *Lanyards (with
                                    logo), *Badges (with logo); *Wi-Fi; *A/V
                                    services; *Meeting bags (with logo) program)
                                    – residents will be selected during the
                                    event for a refund (as a ruffle)
                                </List.Item>
                                <List.Item>
                                    Continental breakfast (Sat or Sun) or plated
                                    lunch (Sat), A/V package
                                </List.Item>
                                <List.Item>
                                    Resident sponsorship (Registration for 10
                                    residents currently enrolled in an ACVO/ECVO
                                    residency
                                </List.Item>
                                <List.Item>
                                    At the entrance a large easel will contain
                                    the logo of the companies and wording that
                                    the activity is sponsored by the company
                                </List.Item>
                            </List>
                            <Heading id="marketing-opportunities">
                                INFO ON MARKETING OPPORTUNITIES:
                            </Heading>
                            <List type="number">
                                <List.Item>
                                    For Packet inserts (pamphlets we place
                                    inside registration bags): Company must mail
                                    the insert to us by Jun 1st , no more than 1
                                    page, any size, any color
                                </List.Item>
                                <List.Item>
                                    Proceeding book Advertisements: Company must
                                    email PDF file of the art by Jun 1st; keep
                                    any writing within 1” of edges; Colors are
                                    OK
                                </List.Item>
                                <List.Item>
                                    Sponsored lecture (2 available): This is an
                                    opportunity for the company to be in front
                                    of everyone and provide a lecture for 10
                                    minutes
                                </List.Item>
                            </List>
                            <Heading id="important-dates">Important Dates</Heading>
                            <DescriptionList
                                items={[
                                    {
                                        term: 'Jan/22',
                                        description:
                                            'Sponsors confirm intent to sponsor/exhibit, priority in selection of booths',
                                    },
																		{
																			term: 'Feb/22',
																			description: 'Registration opens for new companies; forms will be sent to all companies present in the last meeting for registration and booth selection'
																		},
																		{
																			term: 'April/1/19',
																			description: 'All sponsor balances due'
																		},
																		{
																			term: 'May/15th/22',
																			description: 'Late fee for registration ($250); Deadline for submitting proceedings ads and marketing Opportunities'
																		},
																		{term: 'Jul/22/22', description: 'Reception'},
																		{term: 'Jul/22-24/22', description: 'Meeting'}
                                ]}
                            />
                        </TextContainer>
                    </Card>
                </Layout.Section>
            </Layout>
        </Page>
    )
}
