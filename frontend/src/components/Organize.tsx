import { useMoralis } from 'react-moralis';
import { Button, Container, Icon, Modal, Table } from 'semantic-ui-react';
import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getHackathonPrizes, getHackathonsByOrganizer } from '../models/hackathon';
import { ApiContext } from '../hooks/ApiContext';
import moment from 'moment';
import { HackathonDetails } from './HackathonDetails';
import { HackathonMetadata, HackathonStage } from '../models/hackathon.types';
import { AddPrize } from './AddPrize';

export function Organize() {
  const { Moralis, user } = useMoralis();
  const { setShowSpinner } = useContext(ApiContext);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [modalPrizeOpen, setModalPrizeOpen] = React.useState(false);
  const [selectedHackathon, setSelectedHackathon] = React.useState<HackathonMetadata>();

  const [hackathons, setHackathons] = useState<HackathonMetadata[]>([]);
  useEffect(() => {
    if (!user || !user.get('ethAddress')) {
      return;
    }

    setShowSpinner(true);

    getHackathonsByOrganizer(Moralis, user.get('ethAddress'))
      .then(setHackathons)
      .finally(() => {
        setShowSpinner(false);
      });
  }, [user, Moralis, setShowSpinner]);

  const showDetails = (row: HackathonMetadata) => {
    setShowSpinner(true);
    setSelectedHackathon(row);

    if (row.prizes) {
      setShowSpinner(true);
      setModalOpen(true);
    } else {
      getHackathonPrizes(Moralis, row).finally(() => {
        setShowSpinner(false);
        setModalOpen(true);
      });
    }
  };

  const addPrize = (row: HackathonMetadata) => {
    setSelectedHackathon(row);
    setModalPrizeOpen(true);
  };

  return (
    <Container>
      <Link to="/organize/create">
        <Button color="pink">
          <Icon name="add circle" size="small" />
          Create a new hackathon
        </Button>
      </Link>
      <h1>List of hackathons that you're an organizer of:</h1>
      <Table celled inverted>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Id</Table.HeaderCell>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Stage</Table.HeaderCell>
            <Table.HeaderCell>Start</Table.HeaderCell>
            <Table.HeaderCell>End</Table.HeaderCell>
            <Table.HeaderCell>Actions</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {hackathons.map((row, idx) => (
            <Table.Row key={idx}>
              <Table.Cell>{row.id.toString()}</Table.Cell>
              <Table.Cell>{row.name}</Table.Cell>
              <Table.Cell>{HackathonStage[row.stage]}</Table.Cell>
              <Table.Cell>{moment(row.timestampStart * 1000).format('YYYY-MM-DD HH:mm')}</Table.Cell>
              <Table.Cell>{moment(row.timestampEnd * 1000).format('YYYY-MM-DD HH:mm')}</Table.Cell>
              <Table.Cell>
                <Button color="green" onClick={() => { showDetails(row); }}>Show details</Button>
                { (row.stage === HackathonStage.NEW) && <Button color="pink" onClick={() => { addPrize(row); }}>Add prize</Button> }
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
      {
        selectedHackathon && <Modal onClose={() => setModalOpen(false)} onOpen={() => setModalOpen(true)} open={modalOpen}>
          <Modal.Content>
            <HackathonDetails hackathonMetadata={selectedHackathon} />
          </Modal.Content>
        </Modal>
      }
      {
        selectedHackathon && <Modal onClose={() => setModalPrizeOpen(false)} onOpen={() => setModalPrizeOpen(true)} open={modalPrizeOpen}>
          <Modal.Content>
            <AddPrize hackathonMetadata={selectedHackathon} />
          </Modal.Content>
        </Modal>
      }
    </Container>
  );
}
