import { BoothLocations, SponsorshipPreferences, MarketingOpportunities, GeneralSupport } from "../utils/const"

const calcPrice = ({ boothLocation, sponsorshipPreferrence, marketingOpportunities, generalSupports, }: any) => {


	const boothPrice = BoothLocations.find(e => e.name === boothLocation)?.price as number
	const boothDisc = SponsorshipPreferences.find(s => s.name === sponsorshipPreferrence)?.disc as number
	const sponsorshipPrice = SponsorshipPreferences.find(s => s.name === sponsorshipPreferrence)?.price as number

	const marketingPrices = MarketingOpportunities.filter(value => marketingOpportunities.includes(value.name)).reduce((acc, v) => v.price + acc, 0)
	const generalSupportPrices = GeneralSupport.filter(value => generalSupports.includes(value.name)).reduce((acc, v) => v.price + acc, 0)

	const total = (1 - boothDisc / 100) * boothPrice + sponsorshipPrice + marketingPrices + generalSupportPrices

	return total
}

export default calcPrice