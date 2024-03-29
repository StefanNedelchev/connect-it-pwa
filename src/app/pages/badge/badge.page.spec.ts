import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { BadgePage } from './badge.page';

describe('BadgePage', () => {
  let component: BadgePage;
  let fixture: ComponentFixture<BadgePage>;
  let badgeContent: number | undefined;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BadgePage, IonicModule.forRoot(), FormsModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    badgeContent = undefined;

    Object.defineProperty(window.navigator, 'setAppBadge', {
      value: (content: number): Promise<void> => {
        badgeContent = content;
        return Promise.resolve();
      },
      writable: true,
    });

    Object.defineProperty(window.navigator, 'clearAppBadge', {
      value: (): Promise<void> => {
        badgeContent = 0;
        return Promise.resolve();
      },
      writable: true,
    });

    fixture = TestBed.createComponent(BadgePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#setBadge', () => {
    it('should set badge', async () => {
      // Arrange
      const testValue = 14;
      component.badgeContent = testValue;

      // Act
      component.setBadge();
      await fixture.whenStable();

      // Assert
      expect(badgeContent).toBe(testValue);
    });

    it('should catch badge error', async () => {
      // Arrange
      const errorMessage = 'test';
      Object.defineProperty(window.navigator, 'setAppBadge', {
        value: (): Promise<void> => Promise.reject(new Error(errorMessage)),
        writable: true,
      });
      const testValue = 14;
      component.badgeContent = testValue;

      // Act
      component.setBadge();
      await fixture.whenStable();

      // Assert
      expect(badgeContent).toBeUndefined();
      expect(component.errorMessage).toMatch(errorMessage);

      // Act
      Object.defineProperty(window.navigator, 'setAppBadge', {
        value: (): Promise<void> => Promise.reject(errorMessage),
        writable: true,
      });
      component.setBadge();
      await fixture.whenStable();

      // Assert
      expect(badgeContent).toBeUndefined();
      expect(component.errorMessage).toMatch(errorMessage);
    });
  });

  describe('#clearBadge', () => {
    it('should clear badge', async () => {
      // Arrange
      badgeContent = 14;

      // Act
      component.clearBadge();
      await fixture.whenStable();

      // Assert
      expect(badgeContent).toBe(0);
    });

    it('should catch badge error', async () => {
      // Arrange
      const errorMessage = 'test';
      Object.defineProperty(window.navigator, 'clearAppBadge', {
        value: (): Promise<void> => Promise.reject(new Error(errorMessage)),
        writable: true,
      });
      const testValue = 14;
      badgeContent = testValue;

      // Act
      component.clearBadge();
      await fixture.whenStable();

      // Assert
      expect(badgeContent).toBe(testValue);
      expect(component.errorMessage).toMatch(errorMessage);
    });
  });
});
