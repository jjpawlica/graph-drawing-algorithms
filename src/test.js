const populationFitness = [0.3, 0.4, 0.2, 0.1];
const value = 0.4;

const generateNewPopulation = (populationFitness, random) => {
    let fitnessSum = 0;

    for (let i = 0; i < populationFitness.length; i += 1) {
        fitnessSum += populationFitness[i];
    }

    let probablitySum = 0;
    const probabilites = [];

    for (let j = 0; j < populationFitness.length; j += 1) {
        const currentProbability = probablitySum + populationFitness[j] / fitnessSum;
        probabilites.push(currentProbability);
        probablitySum += populationFitness[j] / fitnessSum;
    }

    const num = random;

}
};

generateNewPopulation(populationFitness, value);
