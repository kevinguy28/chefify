import dairy from "@/assets/ingredientType/dairy.png";
import fruitsVegetables from "@/assets/ingredientType/fruitsVegetables.png";
import grains from "@/assets/ingredientType/grains.png";
import herbsSpices from "@/assets/ingredientType/herbsSpices.png";
import protein from "@/assets/ingredientType/protein.png";
import other from "@/assets/ingredientType/other.png";

export function convertIngredientType(ingredient: string) {
    if (ingredient === "dairy") {
        return <img src={dairy} alt="Dairy" />;
    } else if (ingredient === "fruitsVegetables") {
        return <img src={fruitsVegetables} alt="Dairy" />;
    } else if (ingredient === "grains") {
        return <img src={grains} alt="Dairy" />;
    } else if (ingredient === "herbsSpices") {
        return <img src={herbsSpices} alt="Dairy" />;
    } else if (ingredient === "protein") {
        return <img src={protein} alt="Dairy" />;
    } else if (ingredient === "other") {
        return <img src={other} alt="Dairy" />;
    } else {
        return <img src={other} alt="Dairy" />;
    }
}
