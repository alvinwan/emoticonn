import nltk
import csv
import test

# https://github.com/shivam5992/textstat
from textstat.textstat import textstat as ts

class DominantReactionClassifier(object):
    """Classifies dominant reactions for each post, excluding likes."""

    TRAIN_SET_SIZE = 500

    def __init__(self, filepath):
        self.filepath = filepath
        self.__classifier = None

    def classify(self, text):
        """Use classifier"""
        assert self.__classifier is not None, 'Train classifier first'
        return self.__classifier.classify(text).replace('num_', '')

    def extract_features(self, text):
        """
        Extract features from a single body of text, and return the
        dictionary of features.
        """
        return {
            'length': len(text),
            'difficult_words': ts.difficult_words(text),
            'smog_index': ts.smog_index(text)
        }

    def train(self):
        """
        Extract feature sets, split into training and test sets,
        then run the Naiive Bayes classifer on training data.
        """
        featuresets = self.__generate_feature_sets()
        self.__train_set = featuresets[self.TRAIN_SET_SIZE:]
        self.__test_set = featuresets[:self.TRAIN_SET_SIZE]
        self.__classifier = nltk.NaiveBayesClassifier.train(
            self.__train_set)

    def score(self):
        """
        Gauge accuracy of the classifier by running it against the
        previously-isolated test data.
        """
        return nltk.classify.accuracy(
            self.__classifier,
            self.__test_set)

    def __generate_feature_sets(self):
        """Generate sets of features using labeled posts."""
        return [(self.extract_features(text), reaction) for
            text, reaction in self.__generate_labeled_posts()]

    def __generate_labeled_posts(self):
        """Generates labeled posts from raw post data"""
        data = []
        with open(self.filepath, 'rb') as csvfile:
            reader = csv.reader(csvfile)
            header = next(reader)
            for row in reader:
                data.append(self.__generate_labeled_datum(header, row))
        return data

    def __generate_labeled_datum(self, header, row):
        """
        Labels each chunk of post text with the name of the dominant
        reaction
        """
        dominant_reaction = None
        dominant_reaction_count = -1
        for col, datum in zip(header, row):
            if col == 'text':
                text = datum
            elif col.startswith('num'):
                if datum > dominant_reaction_count:
                    dominant_reaction_count = datum
                    dominant_reaction = col.replace('nums_', '')
        return text, dominant_reaction

if __name__ == '__main__':
    classifier = DominantReactionClassifier('data/post_reactions.csv')
    classifier.train()
    print(classifier.score())
