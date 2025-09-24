const Mission = () => {
  return (
    <section id="about" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-8 text-foreground">
            Our{" "}
            <span className="relative">
              Mission
              <div className="absolute bottom-0 left-0 w-full h-1 bg-primary transform scale-x-100 origin-left transition-transform duration-500" />
            </span>
          </h2>
          
          <div className="bg-card rounded-2xl p-8 md:p-12 soft-shadow">
            <p className="text-lg md:text-xl leading-relaxed text-muted-foreground">
              At <span className="text-primary font-semibold">CampJam Flooring</span>, our mission is to provide exceptional flooring solutions that combine craftsmanship, durability, and beauty. We pride ourselves on delivering high-quality tiling services that bring elegance and value to every space we touch.
            </p>
            
            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <div className="text-center group">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors duration-300">
                  <div className="w-8 h-8 bg-primary rounded-sm transform rotate-45" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Craftsmanship</h3>
                <p className="text-muted-foreground">Expert artistry in every tile placed</p>
              </div>
              
              <div className="text-center group">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors duration-300">
                  <div className="flex space-x-1">
                    <div className="w-2 h-8 bg-primary rounded-sm" />
                    <div className="w-2 h-8 bg-primary rounded-sm" />
                    <div className="w-2 h-8 bg-primary rounded-sm" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2">Durability</h3>
                <p className="text-muted-foreground">Long-lasting solutions built to endure</p>
              </div>
              
              <div className="text-center group">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors duration-300">
                  <div className="w-8 h-8 border-2 border-primary rounded-full relative">
                    <div className="absolute inset-2 bg-primary rounded-full" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2">Beauty</h3>
                <p className="text-muted-foreground">Elegant designs that inspire and delight</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Mission;