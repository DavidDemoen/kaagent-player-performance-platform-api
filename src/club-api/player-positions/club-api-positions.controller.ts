import { Controller, Get } from "@nestjs/common";
import { ClubApiPositionsService } from "./club-api-positions.service";


@Controller('club-data/player-positions')
export class ClubApiPositionsController {
    constructor(
        private readonly positionsService: ClubApiPositionsService
    ) {}

    @Get()
    async getAllPositions() {
        return this.positionsService.getAllPositions();
    }

}