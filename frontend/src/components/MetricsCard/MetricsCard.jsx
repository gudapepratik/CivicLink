const MetricsCard = ({itemDetails, headingStyles, valueStyles , descStyles}) => {
    return (
      <div className={`w-full p-6 rounded-lg shadow-md ${itemDetails.color} flex flex-col justify-between`}>
        <h3 className={`${headingStyles}`}>{itemDetails.title}</h3>
        <p className={`${valueStyles}`}>{itemDetails.value}</p>
        <p className={`${descStyles}`}>{itemDetails.description}</p>
      </div>
    );
  };
  
  export default MetricsCard;
  