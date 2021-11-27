import { useMoralis } from 'react-moralis';
import { Button, Container, Modal, Table } from 'semantic-ui-react';
import React, { useContext, useEffect, useState } from 'react';
import { getHackathonPrizes, getAllHackathons } from '../models/hackathon';
import { ApiContext } from '../hooks/ApiContext';
import moment from 'moment';
import { HackathonDetails } from './HackathonDetails';
import { HackathonMetadata, HackathonStage } from '../models/hackathon.types';
import { SubmitProject } from './SubmitProject';

export function Participate() {
  const { Moralis, user } = useMoralis();
  const { setShowSpinner } = useContext(ApiContext);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [modalSubmitOpen, setModalSubmitOpen] = React.useState(false);
  const [hackathons, setHackathons] = useState<HackathonMetadata[]>([]);
  const [selectedHackathon, setSelectedHackathon] = React.useState<HackathonMetadata>();
  useEffect(() => {
    setShowSpinner(true);

    getAllHackathons(Moralis)
      .then(setHackathons)
      .finally(() => {
        setShowSpinner(false);
      });
  }, [user, Moralis, setShowSpinner]);

  const decorateWithPrizes = async (row: HackathonMetadata) => {
    setShowSpinner(true);
    setSelectedHackathon(row);

    if (row.prizes) {
      setShowSpinner(false);
    } else {
      return getHackathonPrizes(Moralis, row).finally(() => {
        setShowSpinner(false);
      });
    }
  };

  const showDetails = async (row: HackathonMetadata) => {
    await decorateWithPrizes(row);
    setModalOpen(true);
  };

  const submitProject = async (row: HackathonMetadata) => {
    await decorateWithPrizes(row);
    setModalSubmitOpen(true);
  };

  return (
    <Container>
      <h1>List of all hackathons:</h1>
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
                { (row.stage === HackathonStage.STARTED) && <Button color="pink" onClick={() => { submitProject(row); }}>Submit a project</Button> }
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
        selectedHackathon && <Modal onClose={() => setModalSubmitOpen(false)} onOpen={() => setModalSubmitOpen(true)} open={modalSubmitOpen}>
          <Modal.Content>
            <SubmitProject hackathonMetadata={selectedHackathon} />
          </Modal.Content>
        </Modal>
      }
    </Container>
  );
}
