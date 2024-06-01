import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity, Button } from 'react-native';
import { getLeagues, getTeams, getResults, getFixtures } from '../api';

export default function TabOneScreen() {
  const [leagues, setLeagues] = useState([]);
  const [teams, setTeams] = useState([]);
  const [results, setResults] = useState([]);
  const [fixtures, setFixtures] = useState([]);
  const [selectedLeague, setSelectedLeague] = useState(null);
  const [view, setView] = useState('teams'); // 'teams', 'results', 'fixtures'

  useEffect(() => {
    async function fetchLeagues() {
      const data = await getLeagues();
      console.log(data);  // Log the data to check the structure and URLs
      if (data) {
        setLeagues(data.response);
      }
    }
    fetchLeagues();
  }, []);

  const handleLeaguePress = async (leagueId) => {
    setSelectedLeague(leagueId);
    const teamsData = await getTeams(leagueId);
    const resultsData = await getResults(leagueId);
    const fixturesData = await getFixtures(leagueId);
    if (teamsData) {
      setTeams(teamsData.response);
    }
    if (resultsData) {
      setResults(resultsData.response);
    }
    if (fixturesData) {
      setFixtures(fixturesData.response);
    }
    setView('teams');
  };

  const renderLeagueItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleLeaguePress(item.league.id)}>
      <View style={styles.item}>
        <Image
          source={{ uri: item.league.logo }}
          style={styles.logo}
          onError={(e) => console.log('Error loading image: ', e.nativeEvent.error)}
        />
        <Text style={styles.itemText}>{item.league.name}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderTeamItem = ({ item }) => (
    <View style={styles.item}>
      <Image
        source={{ uri: item.team.logo }}
        style={styles.logo}
        onError={(e) => console.log('Error loading image: ', e.nativeEvent.error)}
      />
      <Text style={styles.itemText}>{item.team.name}</Text>
    </View>
  );

  const renderResultItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.itemText}>{item.teams.home.name} vs {item.teams.away.name}</Text>
      <Text style={styles.itemText}>Score: {item.goals.home} - {item.goals.away}</Text>
    </View>
  );

  const renderFixtureItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.itemText}>{item.teams.home.name} vs {item.teams.away.name}</Text>
      <Text style={styles.itemText}>Date: {new Date(item.fixture.date).toLocaleDateString()}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Football Leagues</Text>
      {selectedLeague ? (
        <View>
          <View style={styles.buttonContainer}>
            <Button title="Teams" onPress={() => setView('teams')} />
            <Button title="Results" onPress={() => setView('results')} />
            <Button title="Fixtures" onPress={() => setView('fixtures')} />
          </View>
          {view === 'teams' && (
            <FlatList
              data={teams}
              keyExtractor={(item) => item.team.id.toString()}
              renderItem={renderTeamItem}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          )}
          {view === 'results' && (
            <FlatList
              data={results}
              keyExtractor={(item) => item.fixture.id.toString()}
              renderItem={renderResultItem}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          )}
          {view === 'fixtures' && (
            <FlatList
              data={fixtures}
              keyExtractor={(item) => item.fixture.id.toString()}
              renderItem={renderFixtureItem}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          )}
        </View>
      ) : (
        <FlatList
          data={leagues}
          keyExtractor={(item) => item.league.id.toString()}
          renderItem={renderLeagueItem}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  item: {
    flexDirection: 'column',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f9c2ff',
    marginVertical: 8,
    marginHorizontal: 16,
  },
  logo: {
    width: 50,
    height: 50,
    marginBottom: 10,
    resizeMode: 'contain',
  },
  itemText: {
    fontSize: 16,
    textAlign: 'center',
  },
  separator: {
    height: 1,
    width: '100%',
    backgroundColor: '#eee',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
});