import Breadcrumb from "@/components/breadcrumb";
import FeaturedSection from "@/components/featuredarticle";
import LatestArticles from "@/components/latestarticles";
// import CategoriesOverviewSection from "@/components/categories";
// import Articles from "@/components/articlessection";
import ArticleClient from "@/components/articleclient";


const Article = () => {
  return (
    <>
      <Breadcrumb 
        items={[
          { 
            label: "Articles", 
            href: "/articles", 
            description: "Explore our articles" 
          }
        ]}
        variant="hero"
      />

      <FeaturedSection />
      <LatestArticles />
      <ArticleClient />

      {/* <CategoriesOverviewSection />

      <Articles /> */}

    </>
  );
};

export default Article;
