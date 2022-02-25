import { RadioButton, Stack, Heading, TextContainer } from "@shopify/polaris"
import { asChoiceField } from "@shopify/react-form"

export default function CustomChoiceList({ field, choices, title, subTitle = '' }) {
	return <Stack vertical>
		<TextContainer>

			<Heading>{title}</Heading>
			<p className="text-slate-700 italic"> {subTitle} </p>
		</TextContainer>
		{choices.map(({ label, value, helpText, disabled }, index) => {
			return <RadioButton disabled={disabled} key={index} label={label} helpText={helpText} {...asChoiceField(field, value)} />
		})}
	</Stack>
}