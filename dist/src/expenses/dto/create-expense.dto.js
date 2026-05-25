"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateExpenseDto = exports.ExpenseCategoryDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
var ExpenseCategoryDto;
(function (ExpenseCategoryDto) {
    ExpenseCategoryDto["GasolinaDiesel"] = "GasolinaDiesel";
    ExpenseCategoryDto["Hotel"] = "Hotel";
    ExpenseCategoryDto["Herramientas"] = "Herramientas";
    ExpenseCategoryDto["Material"] = "Material";
    ExpenseCategoryDto["Other"] = "Other";
})(ExpenseCategoryDto || (exports.ExpenseCategoryDto = ExpenseCategoryDto = {}));
class CreateExpenseDto {
    employeeName;
    date;
    category;
    customCategory;
    amount;
    receiptFileId;
}
exports.CreateExpenseDto = CreateExpenseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'John Smith' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateExpenseDto.prototype, "employeeName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2025-06-15T00:00:00.000Z' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateExpenseDto.prototype, "date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ExpenseCategoryDto, example: 'GasolinaDiesel' }),
    (0, class_validator_1.IsEnum)(ExpenseCategoryDto),
    __metadata("design:type", String)
], CreateExpenseDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Custom category description when category is Other', example: 'Parking fees' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateExpenseDto.prototype, "customCategory", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 125.50 }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateExpenseDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'UUID of uploaded receipt file' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateExpenseDto.prototype, "receiptFileId", void 0);
//# sourceMappingURL=create-expense.dto.js.map