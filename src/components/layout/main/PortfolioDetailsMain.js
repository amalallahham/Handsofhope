import HeroInner from "@/components/sections/hero/HeroInner";
import PortfolioDetailsPrimary from "@/components/sections/portfolios/PortfolioDetailsPrimary";
import getPortfolio from "@/libs/getPortfolio";
import getPreviousNextItem from "@/libs/getPreviousNextItem";

const PortfolioDetailsMain = ({ currentItem, latestCampaigns }) => {
	const items = currentItem ? [currentItem] : [];
	const currentId = currentItem?.id;
	const option = getPreviousNextItem(items, currentId);
	const { title } = option?.currentItem || {};
	return (
		<div>
			{/* <HeroInner
				title={title ? title : "Portfolio details"}
				text={title ? title : "Portfolio details"}
				breadcrums={[{ name: "Portfolio", path: "/portfolios" }]}
				noNeedTitleAnim={true}
			/> */}

			
			<PortfolioDetailsPrimary option={option} campaign={currentItem} latestCampaigns={latestCampaigns} />
		</div>
	);
};

export default PortfolioDetailsMain;
