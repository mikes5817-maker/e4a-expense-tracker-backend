import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';

@ApiTags('Expenses')
@Controller('api')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Get('projects/:projectId/expenses')
  @ApiOperation({ summary: 'List expenses for a project' })
  findAll(
    @Param('projectId') projectId: string,
    @CurrentUser() user: { id: string },
  ) {
    return this.expensesService.findAllForProject(projectId, user.id);
  }

  @Post('projects/:projectId/expenses')
  @ApiOperation({ summary: 'Create an expense under a project' })
  create(
    @Param('projectId') projectId: string,
    @CurrentUser() user: { id: string },
    @Body() dto: CreateExpenseDto,
  ) {
    return this.expensesService.create(projectId, user.id, dto);
  }

  @Get('expenses/:id')
  @ApiOperation({ summary: 'Get expense detail' })
  findOne(
    @Param('id') id: string,
    @CurrentUser() user: { id: string },
  ) {
    return this.expensesService.findOne(id, user.id);
  }

  @Patch('expenses/:id')
  @ApiOperation({ summary: 'Update an expense' })
  update(
    @Param('id') id: string,
    @CurrentUser() user: { id: string },
    @Body() dto: UpdateExpenseDto,
  ) {
    return this.expensesService.update(id, user.id, dto);
  }

  @Delete('expenses/:id')
  @ApiOperation({ summary: 'Delete an expense' })
  remove(
    @Param('id') id: string,
    @CurrentUser() user: { id: string },
  ) {
    return this.expensesService.remove(id, user.id);
  }
}
