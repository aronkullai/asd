import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as solidStar, faStarHalfStroke } from "@fortawesome/free-solid-svg-icons";
import { faStar as regularStar } from "@fortawesome/free-regular-svg-icons";

type RatingStarsProps = {
  ratingOutOf10?: number;
  ratingOutOf5?: number;
  label?: string;
};

export function RatingStars({ ratingOutOf10, ratingOutOf5, label }: RatingStarsProps) {
  const rating = typeof ratingOutOf5 === "number" ? ratingOutOf5 : (ratingOutOf10 || 0) / 2;
  const stars = Array.from({ length: 5 }, (_, index) => {
    const starNumber = index + 1;
    if (rating >= starNumber) return solidStar;
    if (rating >= starNumber - 0.5) return faStarHalfStroke;
    return regularStar;
  });

  return (
    <div className="flex items-center gap-1" aria-label={label || `${rating.toFixed(1)} out of 5 stars`}>
      {stars.map((icon, index) => (
        <FontAwesomeIcon key={index} icon={icon} className="h-4 w-4 text-amber-500" aria-hidden="true" />
      ))}
    </div>
  );
}
