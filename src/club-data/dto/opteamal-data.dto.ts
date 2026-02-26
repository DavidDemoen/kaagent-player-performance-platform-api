export type OpteamalTeamDto = {
  teamkey: string;
  name: string;
};

export type OpteamalPlayerPositionDto = {
  position: string;
  valid_from_dt: string;
  valid_to_dt: string;
};

export type OpteamalPlayerDto = {
  id: string;
  firstname: string;
  lastname: string;
  team: string;
  shirtnumber: number | null;
  active_in_team: boolean;
  primary_team: boolean;
  birthdate: string;
  height: number | null;
  preferred_foot: string | null;
  gender: string | null;
  contract_from_dt: string | null;
  contract_to_dt: string | null;
  nationality: string | null;
  second_nationality: string | null;
  international: boolean | null;
  category: string | null;
  // perhaps a bit to unconstraint, chekc he opteamal api for more details on this field
  extra_information: unknown;
  positions: OpteamalPlayerPositionDto[] | null;
  insert_in_opteamal_dt: string;
  update_player_dt: string;
};

export type OpteamalDataObject = {
  teamsData: OpteamalTeamDto[];
  playersData: OpteamalPlayerDto[];
};
