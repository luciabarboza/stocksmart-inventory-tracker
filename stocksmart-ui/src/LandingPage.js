import './LandingPage.css';

function LandingPage() {
  return (
    <div className="LandingPage">
      <header className="landingpage-header">
      <img src="/Official_logo.png" alt="Landing Page Illustration" className="landing-image" />


        <h2>About StockSmart</h2>
          <p>
            StockSmart is a kitchen inventory management system designed to assist users in tracking their pantry, fridge, and freezer items. It helps users optimize food usage, reduce waste, and maintain healthier eating habits. The system offers real-time inventory updates, nutritional tracking, and alerts for upcoming expiration dates. By doing so, it ensures efficient grocery management and reduces food wastage, making kitchen management smoother and more organized.
          </p>


          <h2>Enhanced Features</h2>
          <p>
            Another feature we added to enhance kitchen management is the shopping list entity. This feature allows users to create and manage shopping lists directly within the system, while also tracking how often certain products are purchased. By monitoring these shopping habits, StockSmart can provide valuable insights and statistics (or "quatrics") about purchasing patterns. This addition not only aids in efficient grocery management but also helps users better plan their shopping trips, ensure they are purchasing the right quantities, and avoid overbuying items they already have on hand.
          </p>
          <p>
            Overall, this feature contributes to a more organized kitchen and smarter shopping practices, ultimately helping users save both time and money.
          </p>

        
      </header>
    </div>
  );
}

export default LandingPage;
